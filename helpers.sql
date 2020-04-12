select
  -- task.id as taskId,
  task.name as taskName,
  categories.name as catName,
  count(task.id) as taskCount,
  min(task.id) as taskId
from task
left join categories on task.categoryId = categories.id
where
  task.created >= curdate()
group by
  task.name,
  categories.name;