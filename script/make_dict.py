def pattern(word):
	ret =  ""
	usedLetter = {}
	curLetter = 0
	for letter in word:
		if usedLetter.get(letter, 0) == 0:
			usedLetter[letter] = chr(curLetter + 97)
			curLetter = curLetter + 1
		ret += usedLetter[letter]
	return ret
	
g_dict = {}

dict = open('dict.txt', 'r')
for word in dict:
	if word[-1] == '\n':
		word = word[:-1]
	patn = pattern(word)
	linkedList = g_dict.get(patn, [])
	linkedList.append(word)
	g_dict[patn] = linkedList

out = open('out.js', 'w')
out.write('var words=new Array(' + str(len(g_dict)) + ');\n')

for patn in g_dict:
	out.write('words["' + patn + '"]=new Array(' + str(len(g_dict[patn])) + ')\n')
	index = 0
	out.write('words["' + patn + '"]=[')
	for word in g_dict[patn]:
		out.write('"' + word + '"')
		index += 1
		if index != len(g_dict[patn]):
			out.write(',')
	out.write(']\n')
	print(patn)
	print(g_dict[patn])

