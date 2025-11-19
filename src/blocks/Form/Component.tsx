'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { WhatSapp } from './Socials/Whatsapp'
import { useToast } from '@/hooks/use-toast'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
  contactInfo?: any
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    contactInfo,
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const clientUrl = getClientSideURL()
  console.log('form base url', clientUrl)

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()
          console.log('res', res)

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            toast.error('Submission failed', {
              description: 'Please check your connection and try again.',
              duration: 5000,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          toast.success('Message sent successfully!', {
            description: "Thank you for reaching out. We'll get back to you within 24 hours.",
            duration: 10000,
          })

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            const redirectUrl = url
            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
          toast.error('Submission failed', {
            description: 'Please check your connection and try again.',
            duration: 5000,
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  if (!contactInfo) {
    return <div>Loading contact information...</div>
  }

  return (
    <section className="bg-background">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Ready to start your next project? Our team is here to help you succeed. Reach out and
              let&apos;s discuss how we can bring your ideas to life.
            </p>
          </div>

          {enableIntro && introContent && !hasSubmitted && (
            <RichText
              className="mb-8 lg:mb-12 text-center"
              data={introContent}
              enableGutter={false}
            />
          )}

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <Mail className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">Email</h3>
                      </div>
                      <p className="text-muted-foreground mb-2 text-sm">
                        {contactInfo.emailResponseTime}
                      </p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-sm font-medium transition-colors hover:underline"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                  <WhatSapp number={contactInfo.whatsapp} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <Phone className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">Phone</h3>
                      </div>
                      <p className="text-muted-foreground mb-2 text-sm">Mon-Fri, 9AM-6PM EST</p>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-sm font-medium transition-colors hover:underline"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <MapPin className="size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">Office</h3>
                      </div>
                      <p className="text-muted-foreground mb-2 text-sm">
                        Schedule an in-person meeting
                      </p>
                      <a href="#" className="text-sm font-medium transition-colors hover:underline">
                        GRA, Port Harcourt
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormProvider {...formMethods}>
                  {!isLoading && hasSubmitted && confirmationType === 'message' && (
                    <RichText data={confirmationMessage} />
                  )}
                  {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
                  {error && (
                    <div className="text-destructive mb-4">{`${error.status || '500'}: ${error.message || ''}`}</div>
                  )}
                  {!hasSubmitted && (
                    <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-4">
                        {formFromProps &&
                          formFromProps.fields &&
                          formFromProps.fields?.map((field, index) => {
                            const Field: React.FC<any> =
                              fields?.[field.blockType as keyof typeof fields]
                            if (Field) {
                              return (
                                <div key={index}>
                                  <Field
                                    form={formFromProps}
                                    {...field}
                                    {...formMethods}
                                    control={control}
                                    errors={errors}
                                    register={register}
                                  />
                                </div>
                              )
                            }
                            return null
                          })}
                      </div>

                      <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? 'Sending...' : submitButtonLabel || 'Submit'}
                      </Button>
                    </form>
                  )}
                </FormProvider>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Separator className="mb-8" />

            <Card className="border-0 shadow-none bg-muted">
              <CardContent className="p-6">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Office Hours</h3>
                    <div className="text-muted-foreground space-y-2 text-sm">
                      {contactInfo.hours?.map((hour: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{hour.days}</span>
                          <span>{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="text-muted-foreground space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Email</span>
                        <span>{contactInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone</span>
                        <span>{contactInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Address</span>
                        <span>
                          {contactInfo.address?.displayText ||
                            `${contactInfo.address?.city}, ${contactInfo.address?.country}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
