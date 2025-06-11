import { formatDistanceToNow } from "date-fns"
import { fa } from "date-fns/locale"

interface Donation {
  id: string
  name: string
  amount: number
  message?: string
  createdAt: string
}

interface DonationsListProps {
  donations: Donation[]
}

export default function DonationsList({ donations }: DonationsListProps) {
  if (donations.length === 0) {
    return <div className="text-center py-8 text-gray-500">هنوز دونیتی دریافت نشده است</div>
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div key={donation.id} className="border-b pb-4 last:border-0">
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium">{donation.name}</div>
            <div className="font-bold">{donation.amount.toLocaleString()} تومان</div>
          </div>
          {donation.message && <div className="text-gray-600 text-sm mb-1">{donation.message}</div>}
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(donation.createdAt), {
              addSuffix: true,
              locale: fa,
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
