# RoomRoute
Classroom Finder and Navigator for User-Interface Design (COMP3435) at University of the West Indies Cave Hill Campus.

# Developer Set-Up
## Node.JS
This install guide will make use of Node Version Manager(NVM) which lets you easily change the node version you are using.
### Install NVM and Node
You can follow [this freecodecamp.org guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) for steps 1-3.
### Install NPM packages
Node comes with Node Package Manager (NPM) installed. You use the following guide to install the relevant packages for this project.

## GIT
GIT is used for version control but more importantly for us, code sharing. It allows multiple people to work on the same project and easily update code between different devices.  
Get GIT [here](https://git-scm.com/downloads/win). _(You can use default settings, but I recommend changing default editor to VSCode.)_  
[Basic Guide for GIT with VSCode](https://youtu.be/z5jZ9lrSpqk?si=wBEw1EyLUa6k_545&t=537)
### Setting Up GIT with your GitHub Account
You can use whatever name you want associated with changes by using this command in the command prompt.
```
git config --global user.name "username you want here. keep it professional"
```
To bind it with your GitHub account, use the following command either with the email you used for GitHub signup, or if you have email privacy enabled, the one provided in your GitHub Settings under emails and primary email. _(Email Privacy is enabled by default)_
```
git config --global user.email "your-email@example.com"
```

## VSCode
We recommend that you use VSCode as your editor as it has good GIT integration and pretty intuitive buttons for pushing and pulling updates from the repository.
### Set Up
Get VSCode [here](https://code.visualstudio.com/download). _(You can just use the default settings.)_
#### To Clone Repository
- Click the Source Control tab on the left. _(If you don't yet have GIT you can install it here.)_
- Click Clone Repository
- Paste the following URL https://github.com/KaiEJH/RoomRoute
- Create/Choose a folder to hold your copy of the code repository.
### VSCode and GIT
When you make a change, you can see each file you changed in the source control tab, where it shows the change in the file when you click on it. Click the + next to the file to stage it (select it for a commit) and then click commit to make it official. Sync will push the changes to everyone. Please look at the [Basic Guide for GIT with VSCode](https://youtu.be/z5jZ9lrSpqk?si=wBEw1EyLUa6k_545&t=537) if you are at this stage and do more research if you are still unsure.
#### IMPORTANT NOTE
Before working on the project, click the refresh icon on the very bottom left of VSCode to pull changes that other people may have made to the project. This would have been explained in the [Basic Guide for GIT with VSCode](https://youtu.be/z5jZ9lrSpqk?si=wBEw1EyLUa6k_545&t=537)
