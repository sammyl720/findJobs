import React, { useState } from 'react'
import { Job as JobType } from './interfaces/jobs'
import { Card, Badge, Button, Collapse } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
type props = {
  job: JobType
}
export default function Job({ job }: props): React.ReactElement {
  const [open, setOpen] = useState(false)
  return (
    <Card className='mb-2'>
      <Card.Body>
        <div className='d-flex justify-content-between'>
          <div>
            <Card.Title>
              {job.title} -{' '}
              <span className='text-muted font-weight-light'>
                {job.company}
              </span>
            </Card.Title>
            <Card.Subtitle className='text-muted mb-2'>
              {new Date(job.created_at).toLocaleDateString()}
            </Card.Subtitle>
            <Badge variant='secondary' className='mr-2'>
              {job.type}
            </Badge>
            <Badge variant='secondary'>{job.location}</Badge>
            <div style={{ wordBreak: 'break-all' }}>
              <ReactMarkdown source={job.how_to_apply} />
            </div>
          </div>
          <img
            className='d-none d-md-block'
            height='50'
            src={job.company_logo}
            alt={job.company}
          />
        </div>
        <Card.Text>
          <Button
            variant='primary'
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            {open ? 'Hide Details' : 'View Details'}
          </Button>
        </Card.Text>
        <Collapse in={open}>
          <div className='mt-4'>
            <ReactMarkdown source={job.description} />
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}
