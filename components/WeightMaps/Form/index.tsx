import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useLowCodeStore from '@/store/lowcodeStore';
import { DatePicker } from '@/components/WeightMaps/DatePicker';

import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Label } from '@/components/ui/label';
import { AISiteLayoutSystemContainer, AISiteLayoutSystemItem } from '@/components/LayoutSystem';

export const WeightForm = ({ name, eventHandlers, children, layout, style, labelCol, wrapperCol }) => {
    const registerWeight = useLowCodeStore(state => state.registerWeight);
    const unregisterWeight = useLowCodeStore(state => state.unregisterWeight);
    // const [form] = Form.useForm();

    // useEffect(() => {
    //   registerWeight(
    //     name,
    //     {
    //       methods: {
    //         submit: async () => {
    //           await form.validateFields()
    //           form.submit();
    //         },
    //         reset: () => {
    //           form.resetFields();
    //         },
    //         validate: () => {
    //           form.validateFields();
    //         },
    //       }
    //     }
    //   )
    //   return () => {
    //     unregisterWeight(name);
    //   }
    // });
    const formSchema = useMemo(() => {
        const formSchema = z.object({
            username: z.string().min(2).max(50),
        })
        return formSchema
    }, [])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <AISiteLayoutSystemItem autoHeight={true} layout={layout}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <AISiteLayoutSystemContainer weightType="Form">
                        {children}
                    </AISiteLayoutSystemContainer>
                </form>
            </Form>
        </AISiteLayoutSystemItem>
    )
}

export const WeightFormInput = ({ name, placeholder, fieldName, label, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem className="flex w-full items-center space-x-2 space-y-0">
                        <FormLabel className='shrink-0'>{label}</FormLabel>
                        <FormControl>
                            <Input placeholder={placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </AISiteLayoutSystemItem>
    )
}
export const WeightInput = ({ name, label, layout, placeholder, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <div className="flex w-full items-center space-x-2">
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                <Input id={name} placeholder={placeholder} />
            </div>
        </AISiteLayoutSystemItem>
    )
}
export const WeightFormCheckbox = ({ fieldName, name, label, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name={fieldName}
                render={({ field }) => {
                    return (
                        <FormItem
                            className="flex w-full items-center space-x-2 space-y-0"
                        >
                            <FormLabel className="font-normal">
                                {label}
                            </FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
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
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                <Checkbox id={name} />
            </div>
        </AISiteLayoutSystemItem>
    )
}
export const WeightFormSelect = ({ name, placeholder, fieldName, label, options, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem className="flex w-full items-center space-x-2 space-y-0">
                        <FormLabel className='shrink-0'>{label}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue id={name} placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    options.map((option: any) => (
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
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue id={name} placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            options.map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
        </AISiteLayoutSystemItem>
    )
}
export const WeightFormRadioList = ({ label, options, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem className="flex w-full items-center space-x-2 space-y-0">
                        <FormLabel className='shrink-0'>{label}</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-2"
                            >
                                {
                                    options.map((option: any) => (
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
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                {/* <Input id={name} placeholder={placeholder} /> */}
                <RadioGroup className='flex'>
                    {
                        options.map((option: any) => (
                            <div className="flex items-center space-x-2">
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
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem className="flex w-full items-center space-x-2 space-y-0">
                        <FormLabel className="shrink-0">
                            {label}
                        </FormLabel>
                        <FormControl className='flex items-center'>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
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
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                <Switch id={name} />
            </div>
        </AISiteLayoutSystemItem>
    )
}
export const WeightFormSlider = ({ fieldName, name, label, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem className="flex w-full items-center space-x-2 space-y-0">
                        <FormLabel className='shrink-0'>{label}</FormLabel>
                        <FormControl>
                            <Slider {...field} />
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
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                <Slider id={name} className='w-full' />
            </div>
        </AISiteLayoutSystemItem>
    )
}
export const WeightFormDatePicker = ({ fieldName, name, label, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <FormField
                // control={form.control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem className="flex w-full items-center space-x-2 space-y-0">
                        <FormLabel className='shrink-0'>{label}</FormLabel>
                        <FormControl>
                            <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </AISiteLayoutSystemItem>
    )
}
export const WeightDatePicker = ({ name, label, layout, style }) => {
    return (
        <AISiteLayoutSystemItem layout={layout}>
            <div className="flex w-full items-center space-x-2">
                <Label htmlFor={name} className='shrink-0'>{label}</Label>
                <DatePicker />
            </div>
        </AISiteLayoutSystemItem>
    )
}
