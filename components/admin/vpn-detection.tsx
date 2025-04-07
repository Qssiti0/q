"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ban, Globe, Search } from "lucide-react"

export function VpnDetection() {
  const blockedIPs = [
    { id: 1, ip: "192.168.1.1", country: "Unknown", type: "VPN", date: "2023-09-15", attempts: 12 },
    { id: 2, ip: "45.123.45.67", country: "Russia", type: "Proxy", date: "2023-09-14", attempts: 8 },
    { id: 3, ip: "78.90.123.45", country: "China", type: "VPN", date: "2023-09-13", attempts: 5 },
    { id: 4, ip: "123.45.67.89", country: "Ukraine", type: "Tor", date: "2023-09-12", attempts: 3 },
    { id: 5, ip: "98.76.54.32", country: "Netherlands", type: "VPN", date: "2023-09-11", attempts: 7 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>VPN & Proxy Detection</CardTitle>
          <CardDescription>Configure settings to detect and block VPNs, proxies, and suspicious IPs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">VPN Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch id="vpn" defaultChecked />
                  <Label htmlFor="vpn">Block VPN connections</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Prevent users from accessing the platform using VPN services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Proxy Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch id="proxy" defaultChecked />
                  <Label htmlFor="proxy">Block proxy connections</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Prevent users from accessing the platform using proxy servers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tor Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch id="tor" defaultChecked />
                  <Label htmlFor="tor">Block Tor connections</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Prevent users from accessing the platform using Tor network
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">IP Detection API Key</Label>
                  <Input id="api-key" type="password" value="••••••••••••••••" readOnly={true} />
                  <p className="text-xs text-muted-foreground">API key for the IP detection service</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="detection-level">Detection Sensitivity</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="detection-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Only block confirmed VPNs</SelectItem>
                      <SelectItem value="medium">Medium - Block VPNs and suspicious IPs</SelectItem>
                      <SelectItem value="high">High - Strict blocking (may affect legitimate users)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Country Restrictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="country-block" />
                  <Label htmlFor="country-block">Enable country-based restrictions</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="countries">Blocked Countries</Label>
                  <Select disabled>
                    <SelectTrigger id="countries">
                      <SelectValue placeholder="Select countries to block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Enable country restrictions above to select countries</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocked IP Addresses</CardTitle>
          <CardDescription>View and manage blocked IP addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search IP addresses..." className="w-full bg-background pl-8" />
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Ban className="mr-2 h-4 w-4" />
              Block IP
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Blocked</TableHead>
                <TableHead>Access Attempts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedIPs.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-medium">{ip.ip}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {ip.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ip.type === "VPN"
                          ? "bg-red-100 text-red-800"
                          : ip.type === "Proxy"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {ip.type}
                    </span>
                  </TableCell>
                  <TableCell>{ip.date}</TableCell>
                  <TableCell>{ip.attempts}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Unblock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

