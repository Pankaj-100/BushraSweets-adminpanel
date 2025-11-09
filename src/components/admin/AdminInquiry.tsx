import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Loader2, Eye } from "lucide-react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import {
  useGetEventInquiriesQuery,
  useGetGeneralInquiriesQuery,
} from "../../store/cmsApi";

// 🔹 Modal Component
function InquiryDetailsModal({
  inquiry,
  type,
  open,
  onClose,
}: {
  inquiry: any;
  type: "event" | "general";
  open: boolean;
  onClose: () => void;
}) {
  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {type === "event" ? "Event Inquiry Details" : "General Inquiry Details"}
          </DialogTitle>
          <DialogDescription>
            Detailed information about the inquiry.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4 py-2">
            {type === "event" ? (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Name:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.firstName} {inquiry.lastName}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Email:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.email}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Phone:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.phone}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Event Type:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.eventType}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Number of Guests:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.numberOfGuests}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Budget:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.budgetRange || "N/A"}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Event Date:</strong>
                      <p className="mt-1 text-muted-foreground">{new Date(inquiry.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Contact Method:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.contactMethod || "N/A"}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Allergies & Restrictions:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.allergiesRestrictions || "None"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Full width sections for longer content */}
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <strong className="text-foreground">Delivery Address:</strong>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{inquiry.deliveryAddress}</p>
                  </div>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <strong className="text-foreground">Special Request:</strong>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{inquiry.specialRequest || "N/A"}</p>
                  </div>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <strong className="text-foreground">Additional Message:</strong>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{inquiry.additionalMessage || "N/A"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Name:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.name}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Email:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.email}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Phone:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-foreground">Inquiry Date:</strong>
                      <p className="mt-1 text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Subject:</strong>
                      <p className="mt-1 text-muted-foreground">{inquiry.subject}</p>
                    </div>
                  </div>
                </div>
                
                {/* Full width section for message */}
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <strong className="text-foreground">Message:</strong>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close button at bottom */}
        <div className="flex-shrink-0 border-t pt-4 mt-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AdminInquiries() {
  // ✅ Pagination states
  const [eventPage, setEventPage] = useState(1);
  const [generalPage, setGeneralPage] = useState(1);

  // ✅ Fetch with pagination
  const {
    data: eventData,
    isLoading: eventLoading,
    isError: eventError,
  } = useGetEventInquiriesQuery({ page: eventPage, limit: 10 });

  const {
    data: generalData,
    isLoading: generalLoading,
    isError: generalError,
  } = useGetGeneralInquiriesQuery({ page: generalPage, limit: 10 });

  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"event" | "general">("event");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (inquiry: any, type: "event" | "general") => {
    setSelectedInquiry(inquiry);
    setModalType(type);
    setIsModalOpen(true);
  };

  if (eventLoading || generalLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (eventError || generalError)
    return <p className="text-red-500">Failed to load inquiries.</p>;

  const eventInquiries = eventData?.inquiries || [];
  const eventTotalPages = eventData?.pagination?.totalPages || 1;

  const generalInquiries = generalData?.queries || [];
  const generalTotalPages = generalData?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      </div>

      <Tabs defaultValue="event" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="event">Event Inquiries</TabsTrigger>
          <TabsTrigger value="general">General Inquiries</TabsTrigger>
        </TabsList>

        {/* Event Inquiries */}
        <TabsContent value="event">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Event Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {eventInquiries.length === 0 ? (
                  <p className="text-center text-muted-foreground">No event inquiries found.</p>
                ) : (
                  <>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-muted text-left">
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Inquiry Date</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventInquiries.map((inq: any) => (
                          <tr key={inq.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">{inq.firstName} {inq.lastName}</td>
                            <td className="p-3">{inq.email}</td>
                            <td className="p-3">{inq.phone}</td>
                            <td className="p-3">{new Date(inq.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <Button variant="outline" size="sm" onClick={() => openModal(inq, "event")}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {eventTotalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                        <Button
                          onClick={() => setEventPage((p) => Math.max(p - 1, 1))}
                          disabled={eventPage === 1}
                          className="px-3"
                        >
                          Prev
                        </Button>

                        {Array.from({ length: eventTotalPages }, (_, i) => i + 1).map((num) => (
                          <Button
                            key={num}
                            onClick={() => setEventPage(num)}
                            variant={num === eventPage ? "default" : "outline"}
                            className="px-3"
                          >
                            {num}
                          </Button>
                        ))}

                        <Button
                          onClick={() => setEventPage((p) => Math.min(p + 1, eventTotalPages))}
                          disabled={eventPage === eventTotalPages}
                          className="px-3"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* General Inquiries */}
        <TabsContent value="general">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>General Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {generalInquiries.length === 0 ? (
                  <p className="text-center text-muted-foreground">No general inquiries found.</p>
                ) : (
                  <>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-muted text-left">
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Inquiry Date</th>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generalInquiries.map((inq: any) => (
                          <tr key={inq.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">{inq.name}</td>
                            <td className="p-3">{inq.email}</td>
                            <td className="p-3">{inq.phone}</td>
                            <td className="p-3">{new Date(inq.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">{inq.subject}</td>
                            <td className="p-3">
                              <Button variant="outline" size="sm" onClick={() => openModal(inq, "general")}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {generalTotalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                        <Button
                          onClick={() => setGeneralPage((p) => Math.max(p - 1, 1))}
                          disabled={generalPage === 1}
                          className="px-3"
                        >
                          Prev
                        </Button>

                        {Array.from({ length: generalTotalPages }, (_, i) => i + 1).map((num) => (
                          <Button
                            key={num}
                            onClick={() => setGeneralPage(num)}
                            variant={num === generalPage ? "default" : "outline"}
                            className="px-3"
                          >
                            {num}
                          </Button>
                        ))}

                        <Button
                          onClick={() => setGeneralPage((p) => Math.min(p + 1, generalTotalPages))}
                          disabled={generalPage === generalTotalPages}
                          className="px-3"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Inquiry Details Modal */}
      <InquiryDetailsModal
        inquiry={selectedInquiry}
        type={modalType}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}