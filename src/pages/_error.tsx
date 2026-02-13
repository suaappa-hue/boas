import { NextPage } from 'next'

const Error: NextPage<{ statusCode?: number }> = ({ statusCode }) => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>{statusCode || '오류'}</h1>
      <p>{statusCode === 404 ? '페이지를 찾을 수 없습니다.' : '오류가 발생했습니다.'}</p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
