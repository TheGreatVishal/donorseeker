"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function LogsFilter({ currentFilters, onFilterChange }) {
  // Local state for filter values
  const [filters, setFilters] = useState({
    startDate: currentFilters.startDate || "",
    endDate: currentFilters.endDate || "",
    ipAddress: currentFilters.ipAddress || "",
    userEmail: currentFilters.userEmail || "",
    section: currentFilters.section || "",
    apiEndpoint: currentFilters.apiEndpoint || "",
    requestType: currentFilters.requestType || "",
    statusCode: currentFilters.statusCode || "",
  })

  // Options for dropdowns
  const [sections, setSections] = useState([])
  const [endpoints, setEndpoints] = useState([])
  const [requestTypes, ] = useState(["GET", "POST", "PUT", "DELETE", "PATCH"])
  const [statusCodes, ] = useState([
    { value: "200", label: "200 - OK" },
    { value: "201", label: "201 - Created" },
    { value: "400", label: "400 - Bad Request" },
    { value: "401", label: "401 - Unauthorized" },
    { value: "403", label: "403 - Forbidden" },
    { value: "404", label: "404 - Not Found" },
    { value: "500", label: "500 - Server Error" },
  ])

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch sections
        const sectionsRes = await fetch("/api/logs/sections")
        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json()
          setSections(sectionsData)
        }

        // Fetch endpoints
        const endpointsRes = await fetch("/api/logs/endpoints")
        if (endpointsRes.ok) {
          const endpointsData = await endpointsRes.json()
          setEndpoints(endpointsData)
        }
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [])

const handleInputChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
}

  // Update local state when select changes
const handleSelectChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
}

const handleDateChange  = (name, date) => {
    if (date) {
        setFilters((prev) => ({
            ...prev,
            [name]: format(date, "yyyy-MM-dd"),
        }))
    } else {
        setFilters((prev) => ({ ...prev, [name]: "" }))
    }
}

  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters)
  }

  // Reset all filters
  const resetFilters = () => {
    const emptyFilters = {
      startDate: "",
      endDate: "",
      ipAddress: "",
      userEmail: "",
      section: "",
      apiEndpoint: "",
      requestType: "",
      statusCode: "",
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(new Date(filters.startDate), "PPP") : "Select date"}
                {filters.startDate && (
                  <X
                    className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDateChange("startDate", null)
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={(date) => handleDateChange("startDate", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(new Date(filters.endDate), "PPP") : "Select date"}
                {filters.endDate && (
                  <X
                    className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDateChange("endDate", null)
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                onSelect={(date) => handleDateChange("endDate", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* IP Address */}
        <div className="space-y-2">
          <Label htmlFor="ipAddress">IP Address</Label>
          <Input
            id="ipAddress"
            name="ipAddress"
            placeholder="e.g. 192.168.1.1"
            value={filters.ipAddress}
            onChange={handleInputChange}
          />
        </div>

        {/* User Email */}
        <div className="space-y-2">
          <Label htmlFor="userEmail">User Email</Label>
          <Input
            id="userEmail"
            name="userEmail"
            placeholder="user@example.com"
            value={filters.userEmail}
            onChange={handleInputChange}
          />
        </div>

        {/* Section */}
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select value={filters.section} onValueChange={(value) => handleSelectChange("section", value)}>
            <SelectTrigger id="section">
              <SelectValue placeholder="All sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Endpoint */}
        <div className="space-y-2">
          <Label htmlFor="apiEndpoint">API Endpoint</Label>
          <Select value={filters.apiEndpoint} onValueChange={(value) => handleSelectChange("apiEndpoint", value)}>
            <SelectTrigger id="apiEndpoint">
              <SelectValue placeholder="All endpoints" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All endpoints</SelectItem>
              {endpoints.map((endpoint) => (
                <SelectItem key={endpoint} value={endpoint}>
                  {endpoint}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Request Type */}
        <div className="space-y-2">
          <Label htmlFor="requestType">Request Type</Label>
          <Select value={filters.requestType} onValueChange={(value) => handleSelectChange("requestType", value)}>
            <SelectTrigger id="requestType">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {requestTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Code */}
        <div className="space-y-2">
          <Label htmlFor="statusCode">Status Code</Label>
          <Select value={filters.statusCode} onValueChange={(value) => handleSelectChange("statusCode", value)}>
            <SelectTrigger id="statusCode">
              <SelectValue placeholder="All status codes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status codes</SelectItem>
              {statusCodes.map((code) => (
                <SelectItem key={code.value} value={code.value}>
                  {code.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}

