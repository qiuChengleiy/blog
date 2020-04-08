sql --- 数据库指令集 操作数据库

规范：
	1. 建议sql语句大写 数据库名小写 支持换行，单词拆开分行 --- 终端小写
	2. 空格缩进




---------- 其它 语句

1. show now();   显示当前时间

2. show warnings; 查看warns



---------- 数据库操作 DDL  ---- 理论上一个项目一个数据库足够


1. show databases;   查看所有存在的数据库   - 名称

2. drop database [if not exists] dbname;  删除指定数据库  --- 相应的在磁盘上删除对应文件夹

3. create database dbname; 创建数据库  --- 一个数据库对应一个文件夹
		create database if not exists dbname;  如果不存在就创建 --- 不会报错
			create database if not exists dbname character set gbk; 设置编码方式 默认是utf8


4. show create database dbname; 查看已创建的数据库  

5. alter database dbname character set utf8 ------ 修改数据库 ---- 不常用

6. use dbname; ---- 使用数据库  ---- 从当前切换到另一个数据库  --- 

7. select databse(); ---- 查看当前正在使用的数据库 名称



------------  数据表操作

主键特性： 非空 、 一定是唯一的  not null  unique  ---- 不能在字段上重复出现且不为空 --- PRIMARY KEY 

数值自增加 ---- auto_increment

创建表必须要有相应的字段

语法： CREATE TABLE employee( 字段 数据类型 [约束条件] DEFAULT 数据, .... , ....); --- default 默认数据
约束条件放在类型的后边 


类型：
	数值：  float(3,2)   浮点数 --- 3表示数值的个数  2表示小数点的位数 ---- 小数点不占位置
		   double ---- 同上
		   TINYINT  --- 小数值
		   INT ---- 存大整数值


	字符串：  char(3) ---- 必须存3个字节 --- 定长  --- 效率高
			 varchar(20)  ---- 0到20字节 有范围 ---  常用 
			 text   -----  长文本数据
			 blob   -----  长文本的二进制数据


	时间：    date ---- YYYY-MM-DD
			 timestamp --- 时间戳

	布尔：    boolean ---  # 数据库默认没有boolean类型 它会自动转成其它类型 --- TINYINT(1) ---为了扩展性更好

## 表操作

```sql
查看数据库有哪些表：  show tables;
查看具体的表内容： desc employee;
查看创建的数据表信息: show create table table_name;

删除表： drop table table_name

修改表名：rename table table_name to new_table_name;

修改表的字符集： alter table table_name  character set utf8;

```

## 创建表 

```sql

CREATE TABLE employee(
	id TINYINT PRIMARY KEY auto_increment,   # 主键不能为空 自增加
	name VARCHAR(25),
	gener boolean,				
	age INT,
	department VARCHAR(20),
	salary DOUBLE(7,2)
);


create table t1(select * from t2);  ----  ps: 复制一张表

# 创建test数据库的emp表  -- 同use test; -> create

CREATE TABLE test.employee(
	id TINYINT PRIMARY KEY auto_increment,   # 主键不能为空 自增加
	name VARCHAR(25),
	gener boolean,				
	age INT,
	department VARCHAR(20),
	salary DOUBLE(7,2)
);



----------  创建带有索引的表 --- 创建会花费时间，但是查询速度非常快


CREATE TABLE test1.emps(
	id TINYINT PRIMARY KEY auto_increment,   
	name VARCHAR(25),
	gener boolean,				
	age INT,
	department VARCHAR(20),
	salary DOUBLE(7,2),

	index index_name (name)    --- 索引
);


+------------+-------------+------+-----+---------+----------------+
| Field      | Type        | Null | Key | Default | Extra          |
+------------+-------------+------+-----+---------+----------------+
| id         | tinyint(4)  | NO   | PRI | NULL    | auto_increment |
| name       | varchar(25) | YES  | MUL | NULL    |                |
| gener      | tinyint(1)  | YES  |     | NULL    |                |
| age        | int(11)     | YES  |     | NULL    |                |
| department | varchar(20) | YES  |     | NULL    |                |
| salary     | double(7,2) | YES  |     | NULL    |                |
+------------+-------------+------+-----+---------+----------------+


CREATE TABLE `emps` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) DEFAULT NULL,
  `gener` tinyint(1) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `department` varchar(20) DEFAULT NULL,
  `salary` double(7,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8




------ 唯一索引

CREATE TABLE test1.emps(
	id TINYINT PRIMARY KEY auto_increment,   
	name VARCHAR(25),
	gener boolean,				
	age INT,
	department VARCHAR(20),
	salary DOUBLE(7,2),

	unique index index_name (name)    --- 索引
);




------ 多列索引

CREATE TABLE test1.emps(
	id TINYINT PRIMARY KEY auto_increment,   
	name VARCHAR(25),
	gener boolean,				
	age INT,
	department VARCHAR(20),
	salary DOUBLE(7,2),

    index index_name (name,age,gener)    --- 索引
);



```



## 操作表 --- 增 删 改 查 

```sql

# alter 可以多操作 ，可以同时增删改查，用逗号分开即可

# 增加字段
alter table employee add is_married TINYINT(1);  # 增加字段   ---- 要设定数据类型不然报错
alter table employee add entry_date DATE not null;  # ---带有约束条件

# 连续增加字段
alter table employee add is_married TINYINT(1),
	 add entry_date DATE not null;



# 删除字段
alter table employee DROP is_married;

alter table employee DROP is_married,
	 DROP entry_date;




# 修改字段

# ---修改类型
alter table employee modify is_married TINYINT(1) not null default 1 [first|after 字段名]; ---- 可以修改类型 还可以调整位置

alter table employee modify is_married TINYINT(1),
	 modify entry_date DATE not null;


# --- 修改字段名和类型 --- 旧 新 类型 条件 
alter table employee change gener ge VARCHAR(20) not null default '男' after salary;



```


## 表记录操作 ----- 增 删 改 查 

```sql

 
# 插入记录： 如果是自增长的ID 突然插入某一个值，下边不插值依然还是按照上个ID自增加

insert into table_name (key1,key2,key3) values (1,2,3);  --- 对应关系
insert into table_name (key2,key3) values (2,3);  ---- 也可以插入具体的某个字段（没有插入的字段可以为空）

insert into table_name (key2,key3) values (2,3),(2,3),(2,3),(2,3),(2,3),(2,3); --- 插入多条数据

insert into table_name values (1,2,3)  ---- 所有字段都要插入数据 

insert into table_name set key1='1',key2='2';  ---- 按照键值来插入





# 修改记录：

update table_name set key1=key1+10 where key2=2;

update table_name set key1=key1+10,k3=k3-1,...,.., where key2=2; --- 修改多条

update table_name set key1=key1+10,k3=k3-1,...,.., where key2=2 and ke4=4; --- 修改多条 --- 多个条件

update table_name set key1=key1+10,k3=k3-1,...,.., where key2=2 or ke4=4; --- 修改多条 --- 满足条件的都可以



# 删除记录

delete from table_name where key1=1; 

delete from table_name;  --- 删除所有记录 --- 表依然存在 --- 一条一条删

truncate table table_name; ---- 删除所有记录 --- 整个一下子清空





# 查询 ---- ****重点**** ------  不会改变数据库的数据

select * from table_name;  --- 查看所有




 ---准备表

   CREATE TABLE Ers(

   id INT PRIMARY KEY  auto_increment,
   name VARCHAR (20),
   JS DOUBLE ,
   Django DOUBLE ,
   OpenStack DOUBLE
);


---- 插数据
INSERT INTO Ers VALUES  (1,"yuan",98,98,98),
                               (2,"xialv",35,98,67),
                               (3,"alex",59,59,62),
                               (4,"wusir",88,89,82),
                               (5,"alvin",88,98,67),
                               (6,"yuan",86,100,55);


------  查找某一个字段下的值 --- 去重 distinct

select distinct name from ers;

select distinct name,JS from ers;  --- 去除多个同时重复的

select name,js from ers;  ---- 查找name 和 js 对应的值

select name js from ers; ----  select name as js from ers;

select name+10,js+10 from ers;   ---- 显示仅仅是加值之后的结果 ----- 数据库并不会发送改变

select name+10 as 姓名,js+10 as 成绩 from ers;  ---- 更改显示的字段名 --- 数据库不会变





----- 条件查找 ---- 过滤查询

select name from ers where js>80;

----- 支持的条件：  >= <=  > <  <> !=    

in(10,30,50) ---是10或30或50

between 10 and 20 ---  10到20之间 --- 闭区间 包括10和20

is --- 是  ---- 找空值 --  key is null

like ---模糊查询 

like '小明%'  -- % 表示任意多字符 比如 小明好 小明好的真好

like '小红_' ---  _ 表示任意1个字符 比如 小红好 小红棒

limit --- 限制

---- 逻辑运算符  ---- 多个条件时需要使用这个

and  --- 且  
or ----  或
not ---- 不是




---- 执行顺序--   from -> where -> select -> group  by  having -> order  by


----- 排序查询

select name,js from ers order by js;  --- 默认是升序

select name,js from ers where js>70 order by js; --- 也可以加条件

select name,js from ers where js>70 order by js desc; ---降序

select name,js+Django as 总成绩 from ers where js>70 order by 总成绩 desc;  --  字段相加和别名 --- 如果是按别名排序就要写别名

select name,js+Django as 总成绩 from ers where js>70 and name like 'yu%' order by 总成绩 desc; --- 加条件



-----  group by 分组查询 -- 聚合操作

select name,js from ers group by name;  --- 按照name分组 - 相同的为一组  ---  推荐用

select name,js from ers group by name order by js; --- 分完组还要排序 

select name,js from ers group by 2; ---- 按字段位置 -- name,js,age 那么js就在2这个位置 就是按照js分组


---- 分组就是为了 聚合操作组里的内容 --- 不能用where操作 -- where是分组之前的操作

select name,sum(js) from ers group by 2; --- 把分好组的组中内容js加起来  ---  和操作

select name,sum(js) from ers group by 2;



--- 条件分组   不能用where操作 -- where是分组之前的操作 ----  用having  --- having也可以做where的事情 

--- where 没分之前效率比 having 高 



----  聚合函数 --  可以分组和不分组后使用

select name,sum(js) from ers group by name having sum(js)>150;  ---  求和

select count(js) from ers where js>100;  ----   js大于100的有多少条记录 ---  计算个数

select avg(js) from ers where js>100;   ----  大于100的 -- 平均数


----  ifnull(key,0) - 如果字段为null的话 按 0处理  ---  不做这个处理可能会出现 最后结果是null

select avg(js) from ers where (ifnull(js,0)+ifnull(age,0))>100; --- 算出js+age大于100的平均数-- 如果是有值为null按0算


select max(js) from ers where ifnull(js,0)>70;  ---  最高分

---  select name,max(js) from ers where ifnull(js,0)>70; --- 不能这么用 -- 因为name不对应

select name,js from ers having ifnull(js,0) = max(js); --- 可以这么做 -- 如果求最大或最小对应的值 用排序做



---- limit --- 限制

select * from ers limit 4; --- 只拿4条数据

select * from ers limit 2,6; --- 从第二个位置往后数只拿6条 --- 不包含2 -- 3-8



-----  regexp '表达式'  -- 正则查询 -- 大多用在字符串查询 ---  ---- like也是模糊查询

select * from ers where name regexp '^yu';   


```


## 外键约束

```sql

---  每一个班主任会对应多个学生 , 而每个学生只能对应一个班主任

----主表

CREATE TABLE ccg(

       id TINYINT PRIMARY KEY auto_increment,
       name VARCHAR (20),
       age INT ,
       is_marriged boolean 

);


INSERT INTO ccg (name,age,is_marriged) VALUES ("冰冰",12,0),
                                                       ("丹丹",14,0),
                                                       ("歪歪",22,0),
                                                       ("姗姗",20,0),
                                                       ("小雨",21,0);

----子表

CREATE TABLE stud(

       id INT PRIMARY KEY auto_increment,
       name VARCHAR (20),
       charger_id TINYINT,     --切记:作为外键一定要和关联主键的数据类型保持一致
       -- [ADD CONSTRAINT charger_fk_stu]FOREIGN KEY (charger_id) REFERENCES ClassCharger(id)

) ENGINE=INNODB;


INSERT INTO stud(name,charger_id) VALUES ("alvin1",2),
                                            ("alvin2",4),
                                            ("alvin3",1),
                                            ("alvin4",3),
                                            ("alvin5",1),
                                            ("alvin6",3),
                                            ("alvin7",2);

 ---  老师id 对应 学生 charger_id  --- 形成约束条件

 ---  FOREIGN KEY (charger_id字表字段) REFERENCES 主表ccg(主表字段id)

 --切记:作为外键一定要和关联主键的数据类型保持一致

CREATE TABLE stud2(

       id INT PRIMARY KEY auto_increment,
       name VARCHAR (20),
       charger_id TINYINT,    
       FOREIGN KEY (charger_id) REFERENCES ccg(id)

) ENGINE=INNODB;

 delete from ccg where name='丽丽';  --- 没法删  --  因为关联着

---  解决办法：  1.删掉子表中关联的数据  或 2. 修改子表中关联的数据

update stud2 set charger_id=2 where charger_id=1;

delete from stud2 where charger_id=1;



-----  增加外键  --- 要确保两张表的数据能对应上 -- 比起A有1  B不存在1 就对不上

alter table stud ADD  CONSTRAINT abc FOREIGN KEY (charger_id) REFERENCES ccg(id); ---- _fk_stu 创建的名称

ALTER TABLE student DROP FOREIGN KEY abc; ---- 删除外键 -- 根据外键名称




-----cascade方式 在父表上update/delete记录时，同步update/delete掉子表的匹配记录

-----外键的级联删除：如果父表中的记录被删除，则子表中对应的记录自动被删除--------
alter table stud ADD  CONSTRAINT abc FOREIGN KEY (charger_id) REFERENCES ccg(id) ON DELETE CASCADE;
 



------set null方式 在父表上update/delete记录时，将子表上匹配记录的列设为null
   -- 要注意子表的外键列不能为not null

alter table stud ADD  CONSTRAINT abc FOREIGN KEY (charger_id) REFERENCES ccg(id) ON DELETE SET NULL;

---  当主表中的数据被删掉时，关联的子表的键变为 null值



------Restrict方式 :拒绝对父表进行删除更新操作(了解)

------No action方式 在mysql中同Restrict,如果子表中有匹配的记录,则不允许对父表对应候选键
   -- 进行update/delete操作（了解）

```







## 多表查询

多表查询： 
		连接查询：
				内连接：
				外连接：
				全连接：


```sql

---  准备两张表

      create table employee(
      emp_id int auto_increment primary key not null,
      emp_name varchar(50),
      age int,
      dept_id int
      );

      insert into employee(emp_name,age,dept_id) values
        ('A',19,200),
        ('B',26,201),
        ('C',30,201),
        ('D',24,202),
        ('E',20,200),
        ('F',38,204);


    create table department(
       dept_id int,
       dept_name varchar(100)
      );

    insert into department values
      (200,'人事部'),
      (201,'技术部'),
      (202,'销售部'),
      (203,'财政部');


------  1.笛卡尔积查询

SELECT * FROM employee,department;  ---  两张表字段合到一块了 --- 


--- 内连接 --- 从两表中筛选数据

SELECT * FROM employee,department where employee.dept_id=department.dept_id;    

select * from employee inner join department on employee.dept_id=department.dept_id;  --- 同上



SELECT employee.emp_name,department.dept_name FROM employee,department where employee.dept_id=department.dept_id;




----- 外链接 --- 左连接：以左边为主，左表所有字段列出来对应     --- 右连同理  ---  全连同理 将左连和右连加起来


--（1）左外连接：在内连接的基础上增加左边有右边没有的结果

 select * from employee left join department on employee.dept_id = department.dept_id;

     +--------+----------+------+---------+---------+-----------+
    | emp_id | emp_name | age  | dept_id | dept_id | dept_name |
    +--------+----------+------+---------+---------+-----------+
    |      1 | A        |   19 |     200 |     200 | 人事部    |
    |      5 | E        |   20 |     200 |     200 | 人事部    |
    |      2 | B        |   26 |     201 |     201 | 技术部    |
    |      3 | C        |   30 |     201 |     201 | 技术部    |
    |      4 | D        |   24 |     202 |     202 | 销售部    |
    |      6 | F        |   38 |     204 |    NULL | NULL      |
    +--------+----------+------+---------+---------+-----------+



 --（2）右外连接：在内连接的基础上增加右边有左边没有的结果

 select * from employee RIGHT JOIN department on employee.dept_id = department.dept_id;

        +--------+----------+------+---------+---------+-----------+
        | emp_id | emp_name | age  | dept_id | dept_id | dept_name |
        +--------+----------+------+---------+---------+-----------+
        |      1 | A        |   19 |     200 |     200 | 人事部    |
        |      2 | B        |   26 |     201 |     201 | 技术部    |
        |      3 | C        |   30 |     201 |     201 | 技术部    |
        |      4 | D        |   24 |     202 |     202 | 销售部    |
        |      5 | E        |   20 |     200 |     200 | 人事部    |
        |   NULL | NULL     | NULL |    NULL |     203 | 财政部    |
        +--------+----------+------+---------+---------+-----------+




--（3）全外连接：在内连接的基础上增加左边有右边没有的和右边有左边没有的结果

    -- mysql不支持全外连接 full JOIN
    -- mysql可以使用此种方式间接实现全外连接  --- union 关键字
    
   select * from employee RIGHT JOIN department on employee.dept_id = department.dept_id
   UNION
   select * from employee LEFT JOIN department on employee.dept_id = department.dept_id;

        

        +--------+----------+------+---------+---------+-----------+
        | emp_id | emp_name | age  | dept_id | dept_id | dept_name |
        +--------+----------+------+---------+---------+-----------+
        |      1 | A        |   19 |     200 |     200 | 人事部    |
        |      2 | B        |   26 |     201 |     201 | 技术部    |
        |      3 | C        |   30 |     201 |     201 | 技术部    |
        |      4 | D        |   24 |     202 |     202 | 销售部    |
        |      5 | E        |   20 |     200 |     200 | 人事部    |
        |   NULL | NULL     | NULL |    NULL |     203 | 财政部    |
        |      6 | F        |   38 |     204 |    NULL | NULL      |
        +--------+----------+------+---------+---------+-----------+

      -- 注意 union与union all的区别：union会去掉相同的纪录



--- 复合条件连接查询


-- 查询员工年龄大于等于25岁的部门

    SELECT DISTINCT department.dept_name
    FROM employee,department
    WHERE employee.dept_id = department.dept_id
    AND age>25;


--以内连接的方式查询employee和department表，并且以age字段的升序方式显示

    select employee.emp_id,employee.emp_name,employee.age,department.dept_name
    from employee,department
    where employee.dept_id = department.dept_id
    order by age asc;




-- 子查询是将一个查询语句嵌套在另一个查询语句中。
-- 内层查询语句的查询结果，可以为外层查询语句提供查询条件。
-- 子查询中可以包含：IN、NOT IN、ANY、ALL、EXISTS 和 NOT EXISTS等关键字
-- 还可以包含比较运算符：= 、 !=、> 、<等


-- 1. 带IN关键字的子查询

   ---查询employee表，但dept_id必须在department表中出现过

   select * from employee
            where dept_id IN
            (select dept_id from department);



+--------+----------+------+---------+
| emp_id | emp_name | age  | dept_id |
+--------+----------+------+---------+
|      1 | A        |   19 |     200 |
|      2 | B        |   26 |     201 |
|      3 | C        |   30 |     201 |
|      4 | D        |   24 |     202 |
|      5 | E        |   20 |     200 |
+--------+----------+------+---------+
5 rows in set (0.01 sec)




-- 2. 带比较运算符的子查询
      --      =、!=、>、>=、<、<=、<>

     -- 查询员工年龄大于等于25岁的部门
     select dept_id,dept_name from department
           where dept_id IN
          (select DISTINCT dept_id from employee where age>=25);

-- 3. 带EXISTS关键字的子查询

-- EXISTS关字键字表示存在。在使用EXISTS关键字时，内层查询语句不返回查询的记录。
-- 而是返回一个真假值。Ture或False
-- 当返回Ture时，外层查询语句将进行查询；当返回值为False时，外层查询语句不进行查询

     select * from employee
              WHERE EXISTS
              (SELECT dept_name from department where dept_id=203);

      --department表中存在dept_id=203，Ture


     select * from employee
                WHERE EXISTS
              (SELECT dept_name from department where dept_id=205);

     -- Empty set (0.00 sec)


    ps:  create table t1(select * from t2);  ---  复制表

```





















































