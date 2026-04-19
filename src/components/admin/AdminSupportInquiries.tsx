import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { logger } from "@/lib/logger";
import {
  MessageSquare,
  RefreshCw,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  User,
  Calendar,
  Tag,
} from "lucide-react";

interface SupportInquiry {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

const categoryLabels: Record<string, string> = {
  general: "General Inquiry",
  technical: "Technical Support",
  account: "Account Issues",
  billing: "Billing & Payments",
  feedback: "Feedback",
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-500", icon: RefreshCw },
  resolved: { label: "Resolved", color: "bg-green-500/10 text-green-500", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground", icon: XCircle },
};

export function AdminSupportInquiries() {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<SupportInquiry | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];

    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.email.toLowerCase().includes(search) ||
          i.subject.toLowerCase().includes(search) ||
          i.message.toLowerCase().includes(search),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((i) => i.category === categoryFilter);
    }

    return result;
  }, [inquiries, searchQuery, statusFilter, categoryFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    // Find the inquiry to get email details
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) {
      toast.error("Inquiry not found");
      return;
    }

    const updates: { status: string; resolved_at?: string | null } = { status: newStatus };

    if (newStatus === "resolved" || newStatus === "closed") {
      updates.resolved_at = new Date().toISOString();
    } else {
      updates.resolved_at = null;
    }

    const { error } = await supabase.from("support_inquiries").update(updates).eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success("Status updated");
    fetchInquiries();
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, ...updates } : null));
    }

    // Send email notification in background
    try {
      const { error: emailError } = await supabase.functions.invoke("send-support-status", {
        body: {
          to: inquiry.email,
          name: inquiry.name,
          status: newStatus,
          inquirySubject: inquiry.subject,
        },
      });

      if (emailError) {
        logger.error("Failed to send status email:", emailError);
        toast.error("Status updated but email notification failed");
      } else {
        toast.success("Email notification sent");
      }
    } catch (emailErr) {
      logger.error("Error sending status email:", emailErr);
    }
  };

  const openDetail = (inquiry: SupportInquiry) => {
    setSelectedInquiry(inquiry);
    setDetailDialogOpen(true);
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "pending").length,
    inProgress: inquiries.filter((i) => i.status === "in_progress").length,
    resolved: inquiries.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Support Inquiries</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchInquiries}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No inquiries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInquiries.map((inquiry) => {
                    const status = statusConfig[inquiry.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <TableRow key={inquiry.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{inquiry.name}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{inquiry.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[inquiry.category] || inquiry.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`gap-1 ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(inquiry)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </p>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6">
              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedInquiry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(selectedInquiry.created_at), "PPpp")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">
                    {categoryLabels[selectedInquiry.category] || selectedInquiry.category}
                  </Badge>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="font-medium mt-1">{selectedInquiry.subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-1 p-4 rounded-lg bg-muted/50 whitespace-pre-wrap text-sm">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <label className="text-sm font-medium">Update Status:</label>
                <div className="flex gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <Button
                        key={key}
                        variant={selectedInquiry.status === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(selectedInquiry.id, key)}
                        className="gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedInquiry && (
              <Button variant="outline" asChild>
                <a href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </a>
              </Button>
            )}
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
