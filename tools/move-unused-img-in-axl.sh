#!/bin/sh

F=`ls -c1 *.png *.gif *.jpg`

mkdir -p unused

for n in $F
do
  if [ -f $n ]
  then
echo -n $n
    G=`grep $n ../axl/*.axl`
    H=`grep $n ../js/*.js`
    if [ "$G" = "" -a "$H" = "" ]
    then
echo -n " ---------->"
      mv $n unused/
    fi
echo
  fi
done

