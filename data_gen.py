import random

random.seed()

dataList = []
for x in range(0,360):
	dataList.append(random.random())

sliding_window = [.5,.5,.5,.5,.5,.5,.5]

for x in range(0,360):
	del sliding_window[0]
	sliding_window.append(dataList[x])
	dataList[x] = sum(sliding_window)/float(3)

print "energydata = {"
print "\t\'history\': {"
print "\t\t\'values\': ["

for i in range(1,13):
	for j in range(1,31):
		print "\t\t\t{"
		vrms = 115
		crms = dataList[i*12 + (j-1)]
		print "\t\t\t\t\'vrms\': "+str(vrms)+","
		print "\t\t\t\t\'crms\': "+str(crms)+","
		print "\t\t\t\t\'wattage\': "+str(crms*vrms)+","
		print "\t\t\t\t\'date\': new Date(2014, "+str(i)+", "+str(j)+", 11, 59, 59)"
		if i != 12 or j != 30:
			print "\t\t\t},"
		else:
			print "\t\t\t}"
print "\t\t]"
print "\t}"
print "};"
