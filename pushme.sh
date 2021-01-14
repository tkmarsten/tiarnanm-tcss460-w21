#This script runs on mac OsX. It will probably NOT work on Windows. It may work on 
#linux depending on the shell used.
MSG=$@
if [ -z "$MSG" ] 
then
	MSG="no comit message"
fi
echo $MSG
git add .
git commit -m "pushme: ${MSG}"
git push -u origin master
