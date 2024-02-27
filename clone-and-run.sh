#!/usr/bin/bash

git clone https://github.com/robert-matthew-brooks/cypress-login-test-2.git
cd cypress-login-test-2 && npm install

while [ 1 ]
do
  clear
  printf "Choose an option:\n\n1 - Run Cypress test suite\n2 - Open Cypress test runner\nX - Exit\n\n"

  read -p ">" option
  case $option in  
    1) npm run cy:run ;; 
    2) npm run cy:open && exit 1 ;; 
    x|X) exit 1 ;; 
  esac

  printf "\n"
  read -p "Press enter to continue"
done
