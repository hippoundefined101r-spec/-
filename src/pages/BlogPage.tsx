import { blogPosts } from '../data/promos'

export function BlogPage() {
  return (
    <>
      <h1 className="page-title">Блог и обзоры</h1>
      <p className="lead" style={{ marginBottom: 16 }}>
        Гайды по выбору техники, обзоры новинок и советы по трейд-ину.
      </p>
      <div className="grid-3">
        {blogPosts.map((b) => (
          <article className="post" key={b.id}>
            <div className="post__cover">{b.emoji}</div>
            <div className="post__body">
              <div className="post__date">{b.date}</div>
              <div className="post__title">{b.title}</div>
              <div className="post__excerpt">{b.excerpt}</div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
