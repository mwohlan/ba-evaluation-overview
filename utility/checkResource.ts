export default function isResource(string: string): boolean {
  const pattern = /([PQ]\d+)/
  return pattern.test(string)
}
