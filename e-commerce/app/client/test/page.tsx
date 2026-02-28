"use client"
import React from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import { Input, Textarea } from "@heroui/input"

export default function TestPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <Navbar />
            <main className="container mx-auto px-6 py-10">
                <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Test Environment</h1>

                <div className="grid gap-8">
                    <Card className="p-6">
                        <CardBody className="space-y-6">
                            <h2 className="text-xl font-bold uppercase tracking-wider">Form Components Test</h2>
                            <div className="space-y-4 max-w-md">
                                <Input
                                    label="Test Input"
                                    placeholder="Type something..."
                                    variant="bordered"
                                />
                                <Textarea
                                    label="Test Textarea"
                                    placeholder="Type something longer..."
                                    variant="bordered"
                                />
                                <Button color="primary" className="font-bold uppercase tracking-widest">
                                    Test Button
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="p-6 bg-emerald-50 border-emerald-100">
                        <CardBody>
                            <p className="text-emerald-700 font-bold uppercase tracking-widest text-sm">
                                If you see this page, the /client/test route is now active and HeroUI components are functioning correctly.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </main>
        </div>
    )
}
