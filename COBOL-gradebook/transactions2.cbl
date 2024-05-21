	Identification Division.
	Program-id.   Assignment3.
	Author.       Omar Alshaali.
	Environment Division.
	Configuration Section.
	Source-computer.      HPMiniOSS429.
	Object-computer.      HPMiniOSS429.
	Input-output Section.
	File-control.
		Select Trans-File assign to "newtransactions.dat"
			organization is line sequential.
	*
	Data Division.
	File Section.
	01 Trans-Rec.
		03 Trans-Date.	
			05 Trans-Month		PIC 99.	
			05 Trans-Day		PIC 99.
			05 Trans-Year		PIC 9999.
		03 Cust-ID		PIC 9999.
		03 Item-Code		PIC 999.
		03 Quantity-Purchased	PIC 99.
		03 Price-Per-Unit	PIC 99V99.
	Working-Storage Section.
	01 End-of-file      	PIC XXX Value "No".
	01 TotalsandAverages.
    	  03  Total-trans      	PIC 999 Value 0.
	  03  Total-purch      	PIC 999 Value 0.
	  03  Trans-cost       	PIC 9999V99 Value 0000.00.
	  03  Total-cost       	PIC 9999V99 Value 0000.00.
       01 Print-rec             PIC X(110).
       01 Detail-line.
	  03 filler      	PIC X(7) value spaces.
          03 Cust-ID-out	PIC 9999.
	  03 filler      	PIC X(9) value spaces.
	  03 Item-Code-out	PIC 999.
	  03 filler             PIC X(9) value spaces.
	  03 Quantity-out	PIC 99.
	  03 filler             PIC X(11) value spaces.
	  03 filler             PIC X value "$".
	  03 Price-out		PIC 99.99.
       01 Column-headings.
    	  03 filler		PIC X(14) value "Customer ID   ".
    	  03 filler		PIC X(12) value "Item Code   ".
    	  03 filler		PIC X(11) value "Quantity   ".
    	  03 filler		PIC X(17) value "Price Per Unit   ".
       01 Output-Fields.
	  03 T-trans-out	PIC ZZ9.
	  03 T-purch-out	PIC ZZ9.
	  03 T-cost-out		PIC ZZZ9.99.
       01 Error-Message.
	  03 ID-Err-Msg		PIC X(80) value " -TRANSACTION REJECTED-".
       Procedure Division.
       Main-Routine.
      *                                                      *
      *    *
      *    *
      *    *
      *                                                      *
       Perform Init.
       Perform Read-Process until End-of-file = "Yes".
       Perform Termination.
       STOP RUN.
       Init.
           Open input Trans-File.
	   Display Print-rec.
	   Move Column-headings to Print-rec.
	   Display Print-rec.
           Read Trans-File at end Move "Yes" to End-of-file.
       Read-Process.
	   IF Cust-ID is Numeric 
	   AND Trans-year = "2022" 
	   AND Item-Code < 101 AND Item-Code > 0
	   AND Quantity-Purchased < 100 AND Quantity-Purchased > 0
	   AND Price-Per-Unit < 80.93 AND Price-Per-Unit > 00.99
		Move Cust-ID to Cust-ID-out
		Move Item-Code to Item-Code-out
	  	Move Quantity-Purchased to Quantity-out
	  	Move Price-Per-Unit to Price-out
		Move Detail-line to Print-rec
		Add 1 to Total-trans
	   	Add Quantity-Purchased to Total-purch
	   	Subtract Trans-cost from Trans-cost
	   	Add Price-Per-Unit to Trans-cost
	   	Multiply Quantity-Purchased by Trans-cost
	   	Add Trans-cost to Total-cost
	   ELSE
		Move ID-Err-msg to Print-rec
	   END-IF.
           Display Print-rec.
           Read Trans-File at end Move "Yes" to End-of-file.
       Termination.
	   Move Total-trans to T-trans-out.
	   Move Total-purch to T-purch-out.
	   Move Total-cost to T-cost-out.
	   Display "".
	   Display "Total Transactions:            " T-trans-out.
	   Display "Total Quantity Purchased:      " T-purch-out.
	   Display "Total Cost:               $" T-cost-out.
           Close Trans-File.