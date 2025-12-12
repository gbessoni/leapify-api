import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json())

// Supabase connection (keys come from Vercel env vars)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Health check
app.get('/', (req, res) => {
  res.send('Leapify API running')
})

// Get all projects (for Browse page)
app.get('/projects', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      short_description,
      price,
      rating,
      creator_name,
      creator_title,
      hero_stack
    `)

  if (error) return res.status(500).json(error)
  res.json(data)
})

// Get single project + curriculum
app.get('/projects/:id', async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      curriculum_items (
        id,
        title,
        order_index,
        is_free
      )
    `)
    .eq('id', id)
    .single()

  if (error) return res.status(500).json(error)
  res.json(data)
})

// Start server (Vercel handles port)
export default app
