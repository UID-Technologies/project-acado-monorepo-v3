import Heading from "@/components/heading";
import LoadingSection from "@/components/LoadingSection";
import SafeHtml from "@/components/SafeHtml";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventById } from "@app/hooks/data/collaborate/useEvents";
import { useParams } from "react-router-dom";


export default function MasterclassCard() {


    const { id } = useParams<{ id: string }>();
    const { data: eventdetails, isLoading } = useEventById(id);

    if (isLoading) return <LoadingSection isLoading={isLoading} title="Loading event details..." description="please wait ....." />;


    const event = eventdetails?.competitions_details?.program;
    const instructions = eventdetails?.competition_instructions;
    const skills = eventdetails?.job_skill_details.all_program_skills;
    // const matched_skills = eventdetails?.job_skill_details.matched_skills;
    const expert = eventdetails?.expert;

    return (
        <div className="flex flex-col">
            <Heading title={event?.name ?? 'Event Details'} description={event?.event_details?.event_category_name ?? ''} className="mb-0" />
            <div className="mt-5 rounded-2xl">
                <Card className="overflow-hidden border-none shadow-none">
                    <CardContent className="p-0">
                        <div className="grid md:grid-cols-2">
                            <div>
                                <img
                                    src={`${event?.image || '/img/others/event.png'}`}
                                    alt="Masterclass"
                                    className="w-full h-fit object-cover rounded-lg"
                                />
                            </div>
                            <div className="px-6 flex flex-col justify-between relative">
                                <div className="absolute top-0 right-4">
                                    {event?.event_details?.subscription_type === 'open' && <Badge className="bg-[#7fbC42] text-white px-3 py-1 rounded-lg text-sm">Free</Badge>}
                                    {event?.event_details?.subscription_type === 'paid' && <Badge className="bg-[--IndexPink] text-white px-3 py-1 rounded-lg text-sm">Paid</Badge>}
                                </div>
                                <div className="space-y-3 text-base text-cblack">
                                    <div className="flex justify-between">
                                        <p><span className="font-semibold">Duration :- </span> 1hrs to 1.5hrs</p>
                                    </div>
                                    <p> <span className="font-semibold">Requisites :- </span>{"-"}</p>
                                    <p><span className="font-semibold">Domain :- </span>{event?.event_details?.functional_domain ?? '-'}</p>
                                    <p><span className="font-semibold">Partner Industry :- </span>{" - "}<span className="text-cgreen"></span></p>
                                    <div>
                                        <p><span className="font-semibold">Skills you will gain :-</span>  {skills?.length ? skills?.join(', ') : 'No Skills Found..'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Description:</p>
                                        <ul className="list-disc list-outside mt-1 space-y-1 line-clamp-4">
                                            <SafeHtml html={event?.description || ''} className="prose-xs" />
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <Button className="bg-[#7fbC42] hover:bg-[#7fbC42] text-white px-6 py-2 rounded-md w-60">
                                        Register
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Tabs defaultValue="expert" className="mt-10">
                    <TabsList className="border-b flex gap-10 text-sm font-medium justify-center bg-transparent">
                        <TabsTrigger value="expert" className="border-b-2 border-transparent text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-cblack text-gray-500">Expert Details</TabsTrigger>
                        <TabsTrigger value="additional" className="border-b-2 border-transparent text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-cblack text-gray-500">Additional Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expert">
                        {
                            expert?.name && <div className="flex flex-wrap gap-10 py-3">
                                <img src={expert?.profile_image || '/img/others/expert.png'} alt={expert?.name || 'Expert'} className="max-w-[10%] rounded-md" />
                                <div className="space-y-2 text-base text-cblack py-1">
                                    <p><span className="font-semibold">Name:</span> {expert?.name}</p>
                                    <p><span className="font-semibold">Role:</span> {expert?.role}</p>
                                    <p><span className="font-semibold">Skills:</span> {expert?.skills?.length ? expert?.skills?.join(', ') : 'No Skills Found..'}</p>
                                </div>
                            </div>
                        }
                        {
                            !expert?.name && <p className="text-gray-500">No Expert Details Found..</p>
                        }
                    </TabsContent>
                    <TabsContent value="additional">
                        <div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-cblack mb-2">About This Event</h4>
                                <SafeHtml html={event?.description ?? '-'} />
                                {
                                    !event?.description && <p className="text-gray-500">No Description available</p>
                                }
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-cblack">Event Instructions</h4>
                                <SafeHtml html={instructions?.instructions?.replace(/\u2022/g, '<br/>• ') ?? ''} />
                                {
                                    !instructions?.instructions && <p className="text-gray-500">No Instructions available</p>
                                }
                            </div>
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-cblack">{`What’s`} in for you</h4>
                                <SafeHtml html={instructions?.whats_in?.replace(/\u2022/g, '<br/>• ') ?? ''} />
                                {
                                    !instructions?.whats_in && <p className="text-gray-500">No Information available</p>
                                }
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-2 text-cblack">Frequently Asked Questions</h4>
                                <SafeHtml html={instructions?.faq?.replace(/\u2022/g, '<br/>• ') ?? ''} />
                                {
                                    !instructions?.faq && <p className="text-gray-500">No FAQs available</p>
                                }
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </div >
    );
}
