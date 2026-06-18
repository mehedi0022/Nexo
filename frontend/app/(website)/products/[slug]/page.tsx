import type { Metadata } from "next"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const { slug } = await props.params

  return {
    title: `${slug} | Nexo`,
    description: `View product details for ${slug} on Nexo.`,
  }
}

export default async function ProductDetailsPage(props: ProductPageProps) {
  const { slug } = await props.params

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-primary">Product</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{slug}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        This server-rendered product route is ready for catalog data fetching and SEO metadata.
      </p>
    </main>
  )
}
