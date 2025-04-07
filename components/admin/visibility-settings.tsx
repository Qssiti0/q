"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VisibilitySettings() {
  const [offerwalls, setOfferwalls] = useState([
    { id: 1, name: "Pollfish", visible: true, homepage: true, priority: "high" },
    { id: 2, name: "Wannads", visible: true, homepage: false, priority: "medium" },
    { id: 3, name: "CPX Research", visible: true, homepage: true, priority: "high" },
    { id: 4, name: "Lootably", visible: true, homepage: false, priority: "low" },
    { id: 5, name: "Admantium", visible: false, homepage: false, priority: "medium" },
    { id: 6, name: "Notik", visible: true, homepage: true, priority: "high" },
    { id: 7, name: "HangMyAds", visible: true, homepage: false, priority: "medium" },
    { id: 8, name: "AdGem", visible: false, homepage: false, priority: "low" },
    { id: 9, name: "Offertoro", visible: true, homepage: true, priority: "high" },
    { id: 10, name: "Adgate Media", visible: true, homepage: false, priority: "medium" },
    { id: 11, name: "OGads", visible: false, homepage: false, priority: "low" },
  ])

  const toggleVisibility = (id: number) => {
    setOfferwalls(offerwalls.map(offerwall => 
      offerwall.id === id 
        ? { ...offerwall, visible: !offerwall.visible } 
        : offerwall
    ))
  }

  const toggleHomepage = (id: number) => {
    setOfferwalls(offerwalls.map(offerwall => 
      offerwall.id === id 
        ? { ...offerwall, homepage: !offerwall.homepage } 
        : offerwall
    ))
  }

  const updatePriority = (id: number, priority: string) => {
    setOfferwalls(offerwalls.map(offerwall => 
      offerwall.id === id 
        ? { ...offerwall, priority } 
        : offerwall
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">إدارة ظهور الشركات</h2>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          حفظ التغييرات
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات الظهور العامة</CardTitle>
          <CardDescription>تحكم في ظهور العناصر المختلفة على المنصة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className\

