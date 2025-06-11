"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Globe } from "lucide-react"
import Image from "next/image"

interface PaymentMethodSelectorProps {
  onSelect: (method: string) => void
  selectedMethod: string
}

export default function PaymentMethodSelector({ onSelect, selectedMethod }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">روش پرداخت را انتخاب کنید</h3>
      <RadioGroup value={selectedMethod} onValueChange={onSelect} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RadioGroupItem value="zarinpal" id="zarinpal" className="peer sr-only" />
          <Label
            htmlFor="zarinpal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
          >
            <div className="mb-3 rounded-full bg-white p-2 w-12 h-12 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=30&width=30"
                alt="زرین‌پال"
                width={30}
                height={30}
                className="h-6 w-6"
              />
            </div>
            <div className="font-medium">زرین‌پال</div>
            <div className="text-xs text-gray-500 mt-1">پرداخت با درگاه بانکی ایران</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
          <Label
            htmlFor="paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
          >
            <div className="mb-3 rounded-full bg-white p-2 w-12 h-12 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=30&width=30"
                alt="PayPal"
                width={30}
                height={30}
                className="h-6 w-6"
              />
            </div>
            <div className="font-medium">PayPal</div>
            <div className="text-xs text-gray-500 mt-1">پرداخت با PayPal</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="creditcard" id="creditcard" className="peer sr-only" />
          <Label
            htmlFor="creditcard"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
          >
            <div className="mb-3 rounded-full bg-white p-2 w-12 h-12 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div className="font-medium">کارت اعتباری</div>
            <div className="text-xs text-gray-500 mt-1">پرداخت با کارت اعتباری بین‌المللی</div>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
          <Label
            htmlFor="crypto"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
          >
            <div className="mb-3 rounded-full bg-white p-2 w-12 h-12 flex items-center justify-center">
              <Globe className="h-6 w-6 text-gray-600" />
            </div>
            <div className="font-medium">ارز دیجیتال</div>
            <div className="text-xs text-gray-500 mt-1">پرداخت با بیت‌کوین، اتریوم و...</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
