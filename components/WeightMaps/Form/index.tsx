import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"
import { AISiteLayoutSystemContainer, AISiteLayoutSystemItem } from '@/components/LayoutSystem';
import useLowCodeStore from '@/hooks/useLowCodeStore';

export const WeightForm = ({ name, eventHandlers, children, layout, style, labelCol, wrapperCol }) => {
  const registerWeight = useLowCodeStore(state => state.registerWeight);
  const unregisterWeight = useLowCodeStore(state => state.unregisterWeight);

  const form = useForm<z.infer<any>>({
  })

  useEffect(() => {
    registerWeight(
      name,
      {
        methods: {
          submit: async () => {
            form.handleSubmit(onSubmit);
          },
          reset: () => {
            form.reset();
          },
          validate: () => {
            form.trigger();
          },
        }
      }
    )
    return () => {
      unregisterWeight(name);
    }
  });

  function onSubmit(values: z.infer<any>) {
    console.log('onSubmit', values)
    eventHandlers.onSubmit && eventHandlers.onSubmit(values)
  }
  return (
    <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
          style={style}
        >
          <AISiteLayoutSystemContainer weightType="Form">
            {children}
          </AISiteLayoutSystemContainer>
        </form>
      </Form>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormInput = ({ name, placeholder, fieldName, label, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => {
          return (
            <FormItem className="flex w-full items-center space-x-2 space-y-0">
              <FormLabel className='grow-[1] basis-3/12 shrink-0'>{label}</FormLabel>
              <FormControl>
                <Input className="grow-[3] basis-9/12 text-sm" placeholder={placeholder}  {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightInput = ({ name, label, layout, placeholder, style }) => {
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <Input id={name} placeholder={placeholder} className='grow-[3] basis-9/12 text-sm' />
      </div>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormCheckbox = ({ fieldName, name, label, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => {
          return (
            <FormItem
              className="flex w-full items-center space-x-2 space-y-0"
            >
              <FormLabel className="grow-[1] basis-3/12 shrink-0">
                {label}
              </FormLabel>
              <FormControl>
                <div
                  className="grow-[3] basis-9/12"
                >
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
            </FormItem>
          )
        }}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightCheckbox = ({ name, label, options, layout, style }) => {
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <div className='grow-[3] basis-9/12'>
          <Checkbox id={name} />
        </div>
      </div>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormSelect = ({ name, placeholder, fieldName, label, options, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex w-full items-center space-x-2 space-y-0">
            <FormLabel className='grow-[1] basis-3/12 shrink-0'>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="grow-[3] basis-9/12">
                  <SelectValue id={name} placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {
                  Array.isArray(options) && options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightSelect = ({ name, placeholder, label, options, layout, style }) => {
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <Select>
          <SelectTrigger className="grow-[3] basis-9/12">
            <SelectValue id={name} placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {
              Array.isArray(options) && options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormRadioList = ({ fieldName, label, options, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex w-full items-center space-x-2 space-y-0">
            <FormLabel className='grow-[1] basis-3/12 shrink-0'>{label}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex grow-[3] basis-9/12 space-x-2"
              >
                {
                  Array.isArray(options) && options.map((option: any) => (
                    <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))
                }
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightRadioList = ({ name, label, options, layout, style }) => {
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <RadioGroup className='grow-[3] basis-9/12'>
          {
            Array.isArray(options) && options.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))
          }
        </RadioGroup>
      </div>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormSwitch = ({ fieldName, name, label, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex w-full items-center space-x-2 space-y-0">
            <FormLabel className="grow-[1] basis-3/12 shrink-0">
              {label}
            </FormLabel>
            <FormControl>
              <div className='grow-[3] basis-9/12'>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightSwitch = ({ name, label, layout, style }) => {
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <div className='grow-[3] basis-9/12'>
          <Switch id={name} />
        </div>
      </div>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormSlider = ({ fieldName, name, label, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex w-full items-center space-x-2 space-y-0">
            <FormLabel className='grow-[1] basis-3/12 shrink-0'>{label}</FormLabel>
            <FormControl>
              <Slider className="grow-[3] basis-9/12" {...field} value={[field.value || 0]} onValueChange={(value: number[]) => field.onChange(value[0])} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightSlider = ({ name, label, layout, style }) => {
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <Slider id={name} className='grow-[3] basis-9/12' />
      </div>
    </AISiteLayoutSystemItem>
  )
}
export const WeightFormDatePicker = ({ fieldName, name, label, layout, style }) => {
  const form = useFormContext()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex w-full items-center space-x-2 space-y-0">
            <FormLabel className="grow-[1] basis-3/12 shrink-0">{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "grow-[3] basis-9/12 pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </AISiteLayoutSystemItem>
  )
}
export const WeightDatePicker = ({ name, label, layout, style }) => {
  const [date, setDate] = React.useState<Date>()
  return (
    <AISiteLayoutSystemItem layout={layout}>
      <div className="flex w-full items-center space-x-2">
        <Label htmlFor={name} className='grow-[1] basis-3/12 shrink-0'>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "grow-[3] basis-9/12 pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? (
                format(date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </AISiteLayoutSystemItem>
  )
}
