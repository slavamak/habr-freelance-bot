import { Telegraf } from 'telegraf'
import { fmt, bold, link } from 'telegraf/format'

const commands = [
  { command: 'start', description: 'Start interacting with the bot' },
  { command: 'add_filter', description: 'Add a new filter for tasks' },
  { command: 'remove_filter', description: 'Remove a filter by its index' },
  { command: 'list_filters', description: 'List all active filters' },
  { command: 'help', description: 'Get help about using the bot' },
]

const filters = {}
const lastTasks = {}

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('start', (ctx) => ctx.reply('Welcome'))

bot.command('help', (ctx) => {
  ctx.reply(fmt`
${bold`Welcome to the Habr Freelance task notifier bot!`} Here are the commands you can use:

/start - Start interacting with the bot.
/add_filter <category> <query> - Add a new filter for tasks.
/remove_filter <filter_index> - Remove a filter by its index.
/list_filters - List all active filters.
/help - Get help about using the bot.

You will receive notifications for new tasks that match your filters!`
  )
})

bot.command('add_filter', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1)
  const category = args[0] || ''
  const query = args[1] || ''
  const userId = ctx.from.id
  if (!filters[userId]) filters[userId] = []
  filters[userId].push({ category, query })
  const message = `Filter added: category="${category}", query="${query}"`
  ctx.reply(message)
  console.log('add_filter', message)
})

bot.command('remove_filter', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1)
  const filterIndex = parseInt(args[0])
  const userId = ctx.from.id
  if (filters[userId] && filters[userId][filterIndex]) {
    filters[userId].splice(filterIndex, 1)
    const message = `Filter ${filterIndex} deleted.`
    ctx.reply(message)
    console.log('remove_filter', message)
  } else {
    const message = 'Filter not found.'
    ctx.reply(message)
    console.log('remove_filter', message)
  }
})

bot.command('list_filters', (ctx) => {
  const userId = ctx.from.id
  if (filters[userId] && filters[userId].length > 0) {
    const filterList = filters[userId].map((f, index) => `${index}: category="${f.category}", query="${f.query}"`).join('\n')
    ctx.reply(`Your filters:\n${filterList}`)
  } else {
    ctx.reply('You do not have filters.')
  }
})

async function checkForNewTasks() {
  const userIds = Object.keys(filters)
  const tasksToNotify = []
  for (const userId of userIds) {
    const userFilters = filters[userId]
    for (const filter of userFilters) {
      const category = filter.category || null
      const query = filter.query || null
      const url = new URL('https://freelance.habr.com/tasks.json')
      if (category) url.searchParams.set('categories', category)
      if (query) url.searchParams.set('q', query)
      const response = await fetch(url)
      const data = await response.json()
      data.forEach(task => {
        if (!lastTasks[task.id]) {
          tasksToNotify.push(task)
          lastTasks[task.id] = task
        };
      })
    }
    tasksToNotify.forEach(task => {
      const message = fmt`
${bold`New Task:`} ${task.title}
${bold`Category:`} ${task.category_name}
${bold`Subcategory:`} ${task.sub_category_name}
${bold`Price:`} ${task.price}
${bold`Published At:`} ${new Date(task.published_at).toLocaleString()}
${bold`Comments Count:`} ${task.task_comments_count}
${bold`Page Views:`} ${task.page_views_count}
${bold`Link:`} ${link('View Task', task.url)}
    `
      bot.telegram.sendMessage(userId, message)
      console.log('New task added:', message.text)
    })
  }
  if (tasksToNotify.length === 0) console.log('No new tasks added')
  else console.log('New tasks added:', tasksToNotify.length)
}

async function main() {
  await bot.telegram.setMyCommands(commands)
  bot.launch()
  console.log('Bot started!')
  setInterval(checkForNewTasks, 60000)
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

main()
