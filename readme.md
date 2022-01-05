# 焖肉面-puzzle hunt工具包
### 它是啥
puzzle hunt是一类解密比赛，它包含很多类谜题。而这个项目是纯前端开发的工具集合，包括解密中比较基础的的单表，查词，nonogram等工具。

这里有个[demo](https://philippica.github.io/cipher_machine/)

### 如何编译、安装
正如你所见的那样，本项目追求极简(~~极度原始~~)的开发风格，唯一用到的工具是用来做minification的webpack

1. 安装npm

2. 如果是第一次运行，请先使用npm install安装所需要的包

3. npm run build
您会在dist目录下生成所有需要的文件

### 包含哪些内容
- #### 带空格的单表暴力
即替换密码，通过一个替换表将26个字母映射到对应的明文上。该工具支持对带空格的替代密码自动解码，网上有类似的工具[quipquip](https://www.quipqiup.com/ "quipquip").但它的计算放在后端。你无法预测网站会不会关闭，会不会被墙
- #### 单词查找
支持正则查找，通配符查找，已经包含，全排列等不同的查找方式，最酷的应该就是相似度查找，例如查找和what相似度为1的单词你能找到
what
chat
whit
wham
ghat
khat
phat
shat
hat
that
wheat
whats
一个类似的工具是[winatwords](https://winatwords.com/ "winatwords")，但它只能支持通配符查询
- #### nonogram
又叫数织。解密比赛常见谜题。众所周知nonogram是NP-Complete难的，因此规模大了计算量指数上升本程序也会卡顿。
本程序加入了大量的剪枝，经过测试在30*30的规模仍然不会卡顿

- #### 魔方
一个3d的魔方，可以在上面任意编辑

### 为什么叫焖肉面
因为代码写的就是~~一坨speghetti~~,本土化一点就是焖肉面了。代码虽然乱了点，功能，速度和效率还是保证的。




