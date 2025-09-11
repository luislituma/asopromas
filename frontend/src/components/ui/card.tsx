import { type FC, type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  )
}

export const CardHeader: FC<CardProps> = ({ className = '', ...props }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

export const CardContent: FC<CardProps> = ({ className = '', ...props }) => {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}
