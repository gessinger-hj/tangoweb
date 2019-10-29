#!/bin/sh


mkdir -p unused

F=`ls -c1 *.tga *.bmp *.svg`
for n in $F
do
  echo "$n -> unused"
  mv $n unused
done

F=`ls -c1 *.png`
for n in $F
do
  D=`grep -s $n *.xml *.gml`
  if [ "$D" = "" ]
  then
    echo "$n -> unused"
    mv $n unused
  fi
done

