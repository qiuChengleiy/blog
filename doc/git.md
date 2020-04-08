## Git 学习笔记

### 基本操作
* 1.git init 初始化本地仓库
* 2.git add filename 添加文件到仓库
* 3.git commit -m "描述说明" 提交到仓库
* 4.git status 查看版本状态     (innsertios 插入 提示)
* 5.git diff 查看上次修改
* 6.git add filename 再次添加到版本库 我就记住啦~
* 7.git log 命令显示从最近到最远的提交日志  [head 表示当前版本]


### 版本切换

* 8.git reset --hard HEAD^ 回退到上一个版本  可以用git log 查看下日志

* 9.git reset --hard 提交名(前7位) 可以返回当前版本  注意： 在命令行窗口没关的情况下

* Git的版本回退速度非常快，因为Git在内部有个指向当前版本的HEAD指针，当你回退版本的时候，Git仅仅是把HEAD从指向append GPL   

* 关键在于 commit id

不小心把命令行窗口关了怎么办?

git还是可以补救的：

* 10.git reflog 记录每一次的命令 它会告诉你 版本的变化 就是提交对应的ID

### 工作区和版本库

* 工作区有一个隐藏目录.git，这个不算工作区，而是Git的版本库

* Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支master，以及指向master的一个指针叫HEAD

* 我们写文件的地方叫工作区======  提交的地方叫版本库（.git它是被隐藏的） ||   版本库： 1.暂存区     2.master分支


* git add 操作是将我们所有的修改提交到暂存区  然后git commit一次性提交到master 每次提交都有一个commit id

* 提交后工作区如果没有做修改 那么它会是干净的

##### 暂存区 一定要理解 ！！！！！！ Git做的是版本管理的修改 而非文件

* git add filename  是把文件修改提交到 暂存区    如果一个文件修改了 并没有git add  直接commit是没法把修改提交上的

* git commit 是一次性将 暂存区的修改 提交到 master



* 用git diff HEAD -- filename命令可以查看工作区和版本库里面最新版本的区别




### 撤销修改

* git checkout -- .file  撤销工作区的修改

* 1.一种是readme.txt自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；

* 2.一种是readme.txt已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。

* 当然 git reset 也可以帮我们回到之前的修改

* git reset HEAD 可以把暂存区的修改撤销掉（unstage）重新放回工作区：  就是丢弃暂存区的修改

* 注意不要和git reset --hard commit_id 混淆   它是用来做版本替换


### 删除操作

* 1.rm  直接删掉工作区的文件
* 2.git rm filename 删掉版本库的文件

当工作区的文件被删除后  可以用git reset --hard 从版本库中恢复该文件

当然我们可以撤销工作区的修改 也可以一键恢复我们的文件 当然在版本库没有被删除的情况下 也就是没有commit的情况下


如果执行git rm 则工作区和版本库都会被删除掉   注意：做了修改后要 commit 提交到master分支 




### 远程仓库


#### 创建本地仓库与远程关联

注意 ： 在这之前需要先创建好ssh key 这样可以判断出 是否是本人关联而不是其他人

* 添加ssh key方法:命令行输入 ssh-keygen -t rsa -C "youremail@example.com" 替换成自己的邮箱
* 设置: 首先找到自己的github账号-> settings -> sshkey -> title(这里可以自己随便写) -> Key
* key: 输入上面的命令之后 默认在/Users/用户名/.ssh 下的 id_rsa.pub,将这个文件的内容复制到github的Key内容里 点击ADD添加 即可


* 1. 关联远程仓库  git remote add origin git@github.com:yourname/git-note.git  

* 2. 首次推送 git push -u origin master

* 3. 以后推送本地  git push origin master

* 4. 更新远程仓库： git pull 

* 5. 推送： git push 


#### 创建远程仓库克隆

* git clone git@github.com:yourname/git-note.git

* cd git-note && ls

* 可以看到远程仓库克隆下来 并且带了一个README.md的文件


#### 合并分支

```git merge branch_name```

建议： 先合并不提交：git merge --no-ff branch_name



#### 查看分支

```Git branch -a```

删除远程分支:

- 使用命令 ```git push origin --delete Chapater6```   可以删除远程分支Chapater6   
      

删除本地分支:
- 使用命令 ```git branch -d Chapater8``` 可以删除本地分支（在主分支中）


清空远程分支 ： 
- 先清空本地在清除远程


#### 远程同步本地

##### 分支相关操作：

* `git branch`                               # 列出本地分支
* `git branch -r`                            # 列出远端分支
* `git branch -a`                            # 列出所有分支
* `git branch -d test`                       # 删除test分支
* `git branch -D test`                       # 强制删除test分支


##### 拉取远程分支并创建本地分支

方法一

* git checkout -b develop origin/develop         # 本地分支名x origin/远程分支名x

使用该方式会在本地新建分支x，并自动切换到该本地分支x。

采用此种方法建立的本地分支会和远程分支建立映射关系。

方式二


* git fetch origin develop:develop                 # 远程分支名x:本地分支名x

使用该方式会在本地新建分支x，但是不会自动切换到该本地分支x，需要手动checkout。

采用此种方法建立的本地分支不会和远程分支建立映射关系。


##### Git pull


git pull命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并。它的完整格式稍稍有点复杂。

```$ git pull <远程主机名> <远程分支名>:<本地分支名>```
比如，取回origin主机的next分支，与本地的master分支合并，需要写成下面这样。

```$ git pull origin next:master```
如果远程分支是与当前分支合并，则冒号后面的部分可以省略。

```$ git pull origin next```
上面命令表示，取回origin/next分支，再与当前分支合并。实质上，这等同于先做git fetch，再做git merge。

```shell
$ git fetch origin
$ git merge origin/next
```
在某些场合，Git会自动在本地分支与远程分支之间，建立一种追踪关系(tracking)。比如，在git clone的时候，所有本地分支默认与远程主机的同名分支，建立追踪关系，也就是说，本地的master分支自动”追踪”origin/master分支。

Git也允许手动建立追踪关系。

```git branch --set-upstream master origin/next```
上面命令指定master分支追踪origin/next分支。

如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名。

```$ git pull origin```
上面命令表示，本地的当前分支自动与对应的origin主机”追踪分支”(remote-tracking branch)进行合并。

如果当前分支只有一个追踪分支，连远程主机名都可以省略


#### commit规范

- [参考](https://juejin.im/post/5bd2debfe51d457abc710b57)



