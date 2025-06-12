import { useState, useEffect } from "react";
import { Message, SupportTicket, MessageType, ReviewStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Send,
  MessageCircle,
  HelpCircle,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/dateUtils";

interface MessageCenterProps {
  trigger?: React.ReactNode;
}

export function MessageCenter({ trigger }: MessageCenterProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New message form state
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
  });

  // Support ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: "",
    content: "",
    category: "technical" as string,
  });

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      const mockMessages: Message[] = [
        {
          id: "1",
          type: "direct",
          subject: "استفسار حول العرض",
          content: "مرحباً، لدي استفسار حول العرض الجديد...",
          senderId: "emp1",
          senderName: "أحمد محمد",
          senderRole: "employee",
          recipientId: user?.id || "",
          recipientName: user?.firstName || "",
          recipientRole: user?.role || "super_admin",
          status: "unread",
          priority: "medium",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockTickets: SupportTicket[] = [
        {
          id: "2",
          type: "support",
          ticketNumber: "SUP-001",
          subject: "مشكلة في النظام",
          content: "أواجه مشكلة في تحميل العروض...",
          senderId: "emp2",
          senderName: "فاطمة أحمد",
          senderRole: "employee",
          recipientId: user?.id || "",
          recipientName: user?.firstName || "",
          recipientRole: user?.role || "super_admin",
          status: "unread",
          category: "technical",
          priority: "high",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setMessages(mockMessages);
      setSupportTickets(mockTickets);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      const message: Message = {
        id: Date.now().toString(),
        type: "direct",
        subject: newMessage.subject,
        content: newMessage.content,
        senderId: user?.id || "",
        senderName: `${user?.firstName} ${user?.lastName}`,
        senderRole: user?.role || "employee",
        recipientId: "admin",
        recipientName: "الإدارة",
        recipientRole: "super_admin",
        status: "unread",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMessages((prev) => [message, ...prev]);
      setNewMessage({
        subject: "",
        content: "",
      });

      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالتك للإدارة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال الرسالة",
        variant: "destructive",
      });
    }
  };

  const sendSupportTicket = async () => {
    try {
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        type: "support",
        ticketNumber: `SUP-${String(Date.now()).slice(-6)}`,
        subject: newTicket.subject,
        content: newTicket.content,
        senderId: user?.id || "",
        senderName: `${user?.firstName} ${user?.lastName}`,
        senderRole: user?.role || "employee",
        recipientId: "admin",
        recipientName: "الدعم الفني",
        recipientRole: "super_admin",
        status: "unread",
        category: newTicket.category as any,
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSupportTickets((prev) => [ticket, ...prev]);
      setNewTicket({
        subject: "",
        content: "",
        category: "technical",
      });

      toast({
        title: "تم إرسال طلب الدعم",
        description: `رقم التذكرة: ${ticket.ticketNumber}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال طلب الدعم",
        variant: "destructive",
      });
    }
  };

  const updateTicketStatus = async (
    ticketId: string,
    status: ReviewStatus,
    notes?: string,
  ) => {
    try {
      setSupportTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                reviewStatus: status,
                reviewNotes: notes,
                updatedAt: new Date().toISOString(),
              }
            : ticket,
        ),
      );

      toast({
        title: "تم تحديث حالة التذكرة",
        description: "تم تحديث حالة طلب الدعم بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث حالة التذكرة",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, reviewStatus?: string) => {
    if (reviewStatus) {
      switch (reviewStatus) {
        case "approved":
          return (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 ml-1" />
              مقبول
            </Badge>
          );
        case "rejected":
          return (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <XCircle className="w-3 h-3 ml-1" />
              مرفوض
            </Badge>
          );
        case "needs_review":
          return (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <AlertTriangle className="w-3 h-3 ml-1" />
              يحتاج مراجعة
            </Badge>
          );
        default:
          return (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="w-3 h-3 ml-1" />
              قيد المراجعة
            </Badge>
          );
      }
    }

    switch (status) {
      case "read":
        return <Badge variant="secondary">مقروءة</Badge>;
      case "replied":
        return <Badge variant="default">تم الرد</Badge>;
      case "closed":
        return <Badge variant="outline">مغلقة</Badge>;
      default:
        return <Badge variant="destructive">جديدة</Badge>;
    }
  };

  const MessageCard = ({ message }: { message: Message }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 bg-gray-100 rounded-full p-2" />
            <div>
              <h4 className="font-medium">{message.senderName}</h4>
              <p className="text-sm text-muted-foreground">
                {message.senderRole === "employee"
                  ? "موظف"
                  : message.senderRole === "supplier"
                    ? "مورد"
                    : message.senderRole === "hr"
                      ? "موارد بشرية"
                      : "إدارة"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(message.status, message.reviewStatus)}
            <span className="text-xs text-muted-foreground">
              {formatDate(message.createdAt, "MMM dd, HH:mm", i18n.language)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h5 className="font-medium mb-2">{message.subject}</h5>
        <p className="text-sm text-muted-foreground mb-3">{message.content}</p>

        {user?.role === "super_admin" && "ticketNumber" in message && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  updateTicketStatus(
                    message.id,
                    "needs_review",
                    "تم مراجعة الطلب، سيتم الرد قريباً",
                  )
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <AlertTriangle className="w-4 h-4 ml-1" />
                تحت المراجعة
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateTicketStatus(
                    message.id,
                    "approved",
                    "تم الرد على الطلب بنجاح",
                  )
                }
              >
                <CheckCircle className="w-4 h-4 ml-1" />
                تم الرد
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  updateTicketStatus(message.id, "rejected", "تم إغلاق الطلب")
                }
              >
                <XCircle className="w-4 h-4 ml-1" />
                إغلاق
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ملاحظات المراجعة:</label>
              <textarea
                placeholder="أضف ملاحظات أو رد على الطلب..."
                className="w-full p-2 text-sm border rounded"
                rows={3}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    updateTicketStatus(
                      message.id,
                      "needs_review",
                      e.target.value,
                    );
                  }
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 ml-2" />
            الرسائل والدعم
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            التواصل مع الإدارة
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList
            className={`grid w-full ${user?.role === "super_admin" ? "grid-cols-3" : "grid-cols-2"}`}
          >
            <TabsTrigger value="inbox">
              الرسائل الواردة ({messages.length + supportTickets.length})
            </TabsTrigger>
            {user?.role !== "employee" && (
              <TabsTrigger value="send">راسل الإدارة</TabsTrigger>
            )}
            <TabsTrigger value="support">طلب مساعدة</TabsTrigger>
            {user?.role === "super_admin" && (
              <TabsTrigger value="manage">مراجعة الطلبات</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">جاري التحميل...</div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                  {supportTickets.map((ticket) => (
                    <MessageCard key={ticket.id} message={ticket} />
                  ))}
                  {messages.length === 0 && supportTickets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد رسائل
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {user?.role !== "employee" && (
            <TabsContent value="send" className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    📨 ستصل رسالتك مباشرة إلى الإدارة للمراجعة والرد عليها
                  </p>
                </div>

                <div>
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    value={newMessage.subject}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <Label htmlFor="content">محتوى الرسالة</Label>
                  <Textarea
                    id="content"
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="اكت�� رسالتك هنا..."
                    rows={6}
                  />
                </div>

                <Button onClick={sendMessage} className="w-full">
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الرسالة للإدارة
                </Button>
              </div>
            </TabsContent>
          )}

          <TabsContent value="support" className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  🎧 سيتم إرسال طلب الدعم مباشرة للإدارة التقنية للمراجعة والرد
                </p>
              </div>

              <div>
                <Label htmlFor="category">فئة الطلب</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) =>
                    setNewTicket((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">مشكلة تقنية</SelectItem>
                    <SelectItem value="billing">استفسار مالي</SelectItem>
                    <SelectItem value="feature_request">طلب ميزة</SelectItem>
                    <SelectItem value="bug_report">بلاغ خطأ</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ticket-subject">موضوع الطلب</Label>
                <Input
                  id="ticket-subject"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="موضوع طلب الدعم"
                />
              </div>

              <div>
                <Label htmlFor="ticket-content">وصف المشكلة</Label>
                <Textarea
                  id="ticket-content"
                  value={newTicket.content}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="اشرح المشكلة أو الطلب بالتفصيل..."
                  rows={6}
                />
              </div>

              <Button onClick={sendSupportTicket} className="w-full">
                <HelpCircle className="w-4 h-4 ml-2" />
                إرسال طلب الدعم
              </Button>
            </div>
          </TabsContent>

          {user?.role === "super_admin" && (
            <TabsContent value="manage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    إدارة طلبات الدعم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">
                              #{ticket.ticketNumber} - {ticket.subject}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              من: {ticket.senderName} | الفئة:{" "}
                              {ticket.category === "technical"
                                ? "تقنية"
                                : ticket.category === "billing"
                                  ? "مالية"
                                  : "أخرى"}
                            </p>
                          </div>
                          {getStatusBadge(ticket.status, ticket.reviewStatus)}
                        </div>
                        <p className="text-sm">{ticket.content}</p>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                updateTicketStatus(
                                  ticket.id,
                                  "needs_review",
                                  "تم مراجعة الطلب، سيتم الرد قريباً",
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              تحت المراجعة
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateTicketStatus(
                                  ticket.id,
                                  "approved",
                                  "تم الرد على الطلب بنجاح",
                                )
                              }
                            >
                              تم الرد
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                updateTicketStatus(
                                  ticket.id,
                                  "rejected",
                                  "تم إغلاق الطلب",
                                )
                              }
                            >
                              إغلاق
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              ملاحظات الرد:
                            </label>
                            <textarea
                              placeholder="أضف رد أو ملاحظات للطالب..."
                              className="w-full p-2 text-sm border rounded"
                              rows={3}
                              onBlur={(e) => {
                                if (e.target.value.trim()) {
                                  updateTicketStatus(
                                    ticket.id,
                                    "needs_review",
                                    e.target.value,
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
