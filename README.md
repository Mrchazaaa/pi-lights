node index.js | tee logs.log | grep "got new light level: " &> lightLevels.log



node index.js | tee logs.log | grep -P '(?<=T).*.+?(?=Z)|(?<=:).*' &> lightLevels.log

regex /(?<=T).*.+?(?=Z)|(?<=:).*/g

| grep -P -q $REGEX_DAT

* just output time and lightlevel to seperate json file and use json plotter to draw cool graph :)