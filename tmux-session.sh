#!/bin/zsh

SESSIONNAME="databrary"
tmux has-session -t $SESSIONNAME &> /dev/null

if [ $? != 0 ] 
then 
	tmux new-session -d -s $SESSIONNAME -n 'Make'
	tmux send-keys -t 0 "make docker" C-m	
	tmux split-pane -h -t 0
	tmux send-keys -t 1 "make server_nest" C-m
	tmux split-pane -t 1 -v
	tmux send-keys -t 2 'make client' C-m
	tmux new-window -a -n 'Hasura Console'
	tmux send-keys -t "Hasura Console" "make migrate"
	tmux new-window -a -n 'Ingests'
	tmux send-keys -t "Ingests" "cd ingests" C-m
fi

tmux attach -t $SESSIONNAME:0
