# Contributing

Contribution of code improvements to this library are most welcome. Here are some steps to follow.

## Found a bug?

- Check that an issue does not already exist for the bug -- let's not duplicate effort!
- Create a new issue, if none exists
- Create a pull request

## Creating a Pull Request

- Fork the project and do your work within your fork
- Create a topic branch with your changes
  - Only make changes relevant to your issue
  - Follow existing code patterns, style, and formatting
- Create a pull request
  - The PR exists is created in your fork
  - The base repository of the PR is this project, not your fork
  - Use conventional commit formatting for your PR title and description

## Use Conventional Commits for PRs

_These conventions do not apply to your own local commits._

- Your PR title and description should follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format, but commits on your own feature branches can follow any convention

- The format of your PR title should be as follows

  `<type>[(<scope>)][!]: <description>`

  e.g.

  `feat: add batch function to allow atomic changes`

- Valid PR types are

  - **build** _e.g. changes to build systems_
  - **chore** _e.g. updating dependencies_
  - **ci** _e.g. changes to package release_
  - **docs** _e.g. improved documentation_
  - **feat** _e.g. adding a new feature_
  - **fix** _e.g. fixing non-conforming behaviour_
  - **perf** _e.g. improving memory efficiency_
  - **refactor** _e.g. restructuring code_
  - **revert** _e.g. rolling back a bad code change_
  - **style** _e.g. fixing inconsistent formatting of code_
  - **test** _e.g. adding a missing test_

- The format of the PR body should be as follows

  ```
  [free-form body]

  [BREAKING CHANGE: description]

  [other git trailer-formatted footers]
  ```

- PR titles should always be written in imperative present tense, e.g. _add batch function to allow atomic changes_

- PR titles should be written in lower case whenever possible, but the casing of any program identifiers must be retained

- All breaking changes must be signalled with the allowed exclamation mark (!) in the PR title

- A breaking change should also be signalled with a `BREAKING CHANGE` footer in the message body if the PR description is not empty
