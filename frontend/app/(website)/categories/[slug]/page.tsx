import type { Metadata } from "next"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
  const { slug } = await props.params

  return {
    title: `${slug} products | Nexo`,
    description: `Browse products in the ${slug} category on Nexo.`,
  }
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-primary">Category</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{slug}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        This category page remains server-rendered and can be connected to category/product APIs without moving SEO content to the client.
      </p>
    </main>
  )
}
