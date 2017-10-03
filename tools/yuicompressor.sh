#!/bin/sh

# resolve links - $0 may be a softlink
PRG="$0"
while [ -h "$PRG" ]; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '.*/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`/"$link"
  fi
done
DIR=`dirname "$PRG"`

YUI_JAR=$DIR/yuicompressor-2.4.2.jar
if [ "$1" != "" ]
then
  TEMP_NAME=$1.compressed
  GZ_NAME=$1.gz
  java -jar $YUI_JAR $1 --line-break 0 -o $TEMP_NAME
  gzip $TEMP_NAME
  mv $TEMP_NAME.gz $GZ_NAME
  exit
fi
F=`ls *.js`
for n in $F
do
echo $n
  TEMP_NAME=$n.compressed
  GZ_NAME=$n.gz
  if [ ! -f $GZ_NAME -o $n -nt $GZ_NAME ]
  then
    java -jar $YUI_JAR $n --line-break 0 -o $TEMP_NAME
    gzip $TEMP_NAME
    mv $TEMP_NAME.gz $GZ_NAME
  fi
done
