# Answer Academy Technical Test

This repo is a submission for the following technical test:

> The task is to create an Automation Test framework in Cypress for a login page that tests the login functionality of the https://www.saucedemo.com website, the website itself provides the login credentials required to login.

<details>
  <summary>Click me: <b><u>QUICK START</u></b> (Linux)</summary>

Download and run the script `clone-and-run.sh`, found in the top level of this repo. Alternatively, copy the following command into the shell:

```bash
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
```

</details>

## Installation

To run the test spec on your local machine, follow these steps:

1. Navigate to the folder you want to store the repo:

```bash
cd path/to/store/repo
```

2. Clone the repo files:

```bash
git clone https://github.com/robert-matthew-brooks/cypress-login-test-2.git
```

3. Navigate into the project folder:

```bash
cd cypress-login-test-2
```

4. Install the project dependencies (including the Cypress test runner)

```bash
npm install
```

## Usage

You can use `npm` scripts (while in the project folder) to run the Cypress test suite in the CLI:

```bash
npm run cy:run
```

Or, you can launch the Cypress test runner, and run the test suite using the Cypress GUI:

```bash
npm run cy:open
```

The repo also includes a GitHub workflow file. If you push this code to a GitHub repo, the test suite will automatically run. You can see the test results for my repo here:

https://github.com/robert-matthew-brooks/cypress-login-test-2/actions

## Overview

I have tried to make sure my tests cover import areas and scenarios:

- Happy path / sad path
- Security
- Accessibility

I have also tried to learn about and include examples of standard practices such as:

- Hooks
- Fixtures
- Page Object Model
- Custom Commands
- Recycled session states
- CICD Pipeline

## Links

- https://github.com/robert-matthew-brooks/cypress-login-test-2
- https://www.saucedemo.com/
