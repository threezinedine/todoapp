use todoapp;

select * from users;
select * from tasks;
select * from sessions;
select * from task_orders;

truncate table sessions;

delete from task_orders where id = 1;
delete from tasks where dueDate = '2026-06-01';
truncate table tasks;