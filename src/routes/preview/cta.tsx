import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Props = {
  disabled?: boolean
}

export const PreviewCta = ({ disabled }: Props) => {
  const nav = useNavigate()
  return (
    <div className="flex justify-center pt-4">
      <Button
        onClick={() => nav('/dashboard')}
        className="flex items-center gap-2"
        disabled={!!disabled}
        title={disabled ? 'Upload data to continue' : 'Create dashboard from this data'}
      >
        Create Dashboard
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
