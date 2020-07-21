import React, { useEffect, useState } from 'react'
import useFetchJobs from './useFetchJobs'
import { Container } from 'react-bootstrap'
import { Parameters } from './interfaces/parameters'
import JobsPagination from './JobPagination'
import Job from './Job'
import SearchForm from './SearchForm'

function App() {
  const [params, setParams] = useState<Parameters>({})
  const [page, setPage] = useState(1)
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page)

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const param = e.target.name
    const value = e.target.value
    setPage(1)
    setParams((prevParams) => {
      return { ...prevParams, [param]: value }
    })
  }
  useEffect(() => {
    console.log('app component render')
  }, [])
  return (
    <Container className='my-4'>
      <h1 className='mb-4'>Github Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      {loading && <h1> Loading...</h1>}

      {error && <h1>Error. Try Refreshing</h1>}
      {jobs.map((job) => {
        return <Job key={job.id} job={job} />
      })}
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  )
}

export default App
