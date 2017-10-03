#!/bin/sh


mkdir -p unused
F=`ls -c1 *.bmp`
for n in $F
do
  echo "$n -> unused"
  mv $n unused
done

F=`ls -c1 *.tga`
for n in $F
do
  echo "$n -> unused"
  mv $n unused
done

F=`ls -c1 *.png`
for n in $F
do
  D=`grep $n *.xml`
  if [ "$D" = "" ]
  then
    echo "$n -> unused"
    mv $n unused
  fi
done

F=`ls -c1 *.gif`
for n in $F
do
  D=`grep $n *.xml`
  if [ "$D" = "" ]
  then
    echo "$n -> unused"
    mv $n unused
  fi
done

