const Loading = ({ loadingText }: { loadingText?: string }) => {
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        {loadingText && (
          <p className="mt-2 text-muted-foreground">{loadingText}</p>
        )}
      </div>
    </div>
  )
}

export default Loading
