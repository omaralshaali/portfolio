import matplotlib.pyplot as plt
import random

NUM_EVENTS = 100


def first_finish(events):
    augmented = [(i,events[i][0],events[i][1]) for i in range(len(events))]
    
    ff_list = []
    bar = 0
    
    for j in range(NUM_EVENTS):
        ff_end = float('inf')
        
        for i in range(NUM_EVENTS):
            if (augmented[i][2] < ff_end) and (augmented[i][1] > bar):
                ff_index = i
                ff_end = augmented[ff_index][2]
        
        bar = ff_end
        
        if ff_index in ff_list:
            break
        else:
            ff_list.append(ff_index)

    return ff_list




 
def shortest_duration(events):
    augmented = [(i,events[i][0],events[i][1]) for i in range(len(events))]
    
    sd_list = []
    sd_tuples = []
    sd_index = 0
    
    for j in range(NUM_EVENTS):
        min_diff = float('inf')
        
        for i in range(NUM_EVENTS):
            diff = augmented[i][2] - augmented[i][1]
            
            conflict = isConflict(sd_tuples, augmented[i][1], augmented[i][2])
            
            if (diff < min_diff) and (conflict == False) and (augmented[i][0] not in sd_list):
                sd_index = augmented[i][0]
                min_diff = diff
        
        if sd_index in sd_list:
            break
        else:
            new_tuple = (augmented[sd_index][1], augmented[sd_index][2])
            sd_tuples.append(new_tuple)
            sd_list.append(sd_index)

    return sd_list       


def isConflict(tuples, start, end):
    if len(tuples) == 0:
        return False
    for i in range(len(tuples)):
        if (start > tuples[i][0]) and (start < tuples[i][1]):
            return True
        elif (end > tuples[i][0]) and (end < tuples[i][1]):
            return True
        elif (tuples[i][0] > start) and (tuples[i][0] < end):
            return True
        elif (tuples[i][1] > start) and (tuples[i][1] < end):
            return True
    return False
    



def first_start(events):
    augmented = [(i,events[i][0],events[i][1]) for i in range(len(events))]
    
    fs_list = []
    bar = 0
    
    for j in range(NUM_EVENTS):
        fs_start = float('inf')
        for i in range(NUM_EVENTS):
            if (augmented[i][1] < fs_start) and (augmented[i][1] > bar):
                fs_index = i
                fs_start = augmented[fs_index][1]
                fs_end = augmented[fs_index][2]
        
        bar = fs_end
        
        if fs_index in fs_list:
            break
        else:
            fs_list.append(fs_index)

    return fs_list

     
       






proposed = []
for i in range(NUM_EVENTS):
    # start between 7am and 6pm
    st = random.randint(420,1080)
    # duration varies from 30 minutes to 4 hours
    dur = random.randint(30,240)
    proposed.append((st,st+dur))

ff_picks = first_finish(proposed)
print("first_finish scheduled "+str(len(ff_picks)))

sd_picks= shortest_duration(proposed)
print("shortest_duration scheduled "+str(len(sd_picks)))

fs_picks = first_start(proposed)
print("first_start scheduled "+str(len(fs_picks)))

# lc_picks = least_conflicts(proposed)
# print("least_conflicts scheduled "+str(len(lc_picks)))

colors = ['gray']*NUM_EVENTS
for label in ff_picks:
    colors[label] = 'red'

y = range(len(proposed))
height = [e-s for (s,e) in proposed]
bottoms = [s for (s,e) in proposed]
plt.bar(y, height, width=0.5, bottom=bottoms, align='center', color=colors)
plt.xticks([],[])
plt.show()




"""
Here are some test cases Dr. Yilek will try

events1=[(577, 654), (1069, 1173), (508, 560), (842, 981), (563, 732), (703, 775), (602, 674), (679, 733), (557, 613), (574, 641), (707, 771), (430, 639), (722, 890), (496, 613), (939, 1167), (462, 541), (527, 762), (834, 1067), (491, 710), (1043, 1078), (555, 602), (453, 497), (659, 877), (651, 739), (722, 928), (653, 847), (1013, 1116), (556, 660), (1021, 1172), (1008, 1049), (725, 791), (522, 577), (734, 841), (735, 810), (429, 462), (1017, 1108), (803, 837), (860, 1054), (1012, 1183), (1025, 1195), (659, 770), (621, 666), (922, 968), (971, 1065), (841, 997), (573, 802), (831, 864), (525, 588), (785, 914), (817, 911)]


events2=[(490, 683), (823, 983), (1080, 1236), (905, 1104), (865, 1001), (489, 687), (948, 1140), (955, 1056), (740, 882), (949, 1123), (1044, 1240), (768, 938), (626, 737), (778, 814), (451, 570), (670, 834), (929, 1119), (1030, 1266), (931, 1009), (918, 1141), (466, 532), (470, 679), (894, 1132), (668, 741), (593, 813), (769, 874), (1073, 1167), (965, 1122), (993, 1183), (454, 676), (696, 875), (623, 848), (749, 872), (683, 780), (961, 1046), (497, 620), (700, 864), (468, 677), (656, 686), (722, 792), (1017, 1112), (503, 699), (446, 510), (823, 1017), (999, 1068), (988, 1171), (900, 1108), (582, 745), (423, 633), (816, 989)]

"""









