import { useEffect, useState, useCallback } from 'react'

export function useInfiniteScroll(
  hasMore: boolean,
  loading: boolean,
  onLoadMore: () => void,
  threshold = 100
) {
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (
        !hasMore ||
        loading ||
        isFetching ||
        window.innerHeight + document.documentElement.scrollTop + threshold >=
          document.documentElement.offsetHeight
      ) {
        return
      }
      setIsFetching(true)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, isFetching, threshold])

  useEffect(() => {
    if (!isFetching) return

    const loadMore = async () => {
      await onLoadMore()
      setIsFetching(false)
    }

    loadMore()
  }, [isFetching, onLoadMore])

  return { isFetching, setIsFetching }
}
