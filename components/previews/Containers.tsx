export function PreviewContainer({ children }): JSX.Element {
  return <div className="border dark:border-gray-700 rounded-lg bg-white p-3 dark:bg-slate-900 dark:text-white">{children}</div>
}

export function DownloadBtnContainer({ children }): JSX.Element {
  return (
    <div className="bottom-0 left-0 right-0 z-10 rounded-lg bg-white bg-opacity-80 p-2 backdrop-blur-md dark:bg-slate-900">
      {children}
    </div>
  )
}
