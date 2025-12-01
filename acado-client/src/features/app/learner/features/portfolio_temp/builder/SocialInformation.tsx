import React from 'react';
import { BsBehance, BsDribbble, BsPinterest } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { PhoneIcon } from 'lucide-react'; // ✅ Removed PhoneIcon since it's not used
import { Button } from '@/components/ui/Button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod'; // ✅ Import `ZodType` from here directly
import { Input } from '@/components/ui/Input';
import { FormItem, Form } from '@/components/ui/Form'; // ✅ Assuming these are form layout components
import { PortfolioSocial } from '@app/types/learner/portfolio';
import { addSocialLinks } from '@services/learner/Portfolio';
import { useSnackbar } from 'notistack';

type SocialFormSchema = {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  personal_site?: string;
  behance?: string;
  dribble?: string;
  pinterest?: string;
  other?: string;
  mobile_number?: string;
};

type GeneralInformationProps = {
  portfolio: PortfolioSocial[];
};

const SocialInformation = ({ portfolio }: GeneralInformationProps) => {
  const validationSchema: ZodType<SocialFormSchema> = z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    personal_site: z.string().optional(),
    behance: z.string().optional(),
    dribble: z.string().optional(),
    pinterest: z.string().optional(),
    other: z.string().optional(),
    mobile_number: z.string().optional(),
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SocialFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      twitter: portfolio[0]?.twitter ?? '',
      instagram: portfolio[0]?.insta ?? '',
      linkedin: portfolio[0]?.linkedin ?? '',
      facebook: portfolio[0]?.facebook ?? '',
      personal_site: portfolio[0]?.site_url ?? '',
      behance: portfolio[0]?.bee ?? '',
      dribble: portfolio[0]?.dribble ?? '',
      pinterest: portfolio[0]?.pinterest ?? '',
      other: portfolio[0]?.other ?? '',
      mobile_number: portfolio[0]?.mob_num ?? '',
    },
  });

  const convertEmptyToNull = (value: string | undefined) => {
    return value?.trim() === '' ? null : value;
  };

  const onSubmitData = async (data: SocialFormSchema) => {
    const payload: PortfolioSocial = {
      mob_num: convertEmptyToNull(data.mobile_number),
      linkedin: convertEmptyToNull(data.linkedin),
      facebook: convertEmptyToNull(data.facebook),
      twitter: convertEmptyToNull(data.twitter),
      site_url: convertEmptyToNull(data.personal_site),
      bee: convertEmptyToNull(data.behance),
      dribble: convertEmptyToNull(data.dribble),
      insta: convertEmptyToNull(data.instagram),
      pinterest: convertEmptyToNull(data.pinterest),
      other: convertEmptyToNull(data.other),
      id: 0, // ⚠️ Make sure you update this appropriately in a real-world scenario
    };

    try {
      const response = await addSocialLinks(payload);
      if (response.list === "Insert successfully") {
        enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.error.join(', '), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Profile not updated', { variant: 'error' });
    }
  };


    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-[3.4rem]">
            <div className="flex items-center gap-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-gear text-primary font-bold"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                </svg>
                <span className="text-xl text-primary">Social Information</span>
            </div>
            <Form onSubmit={handleSubmit(onSubmitData)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="flex items-center gap-3">
                        <svg
                            width="25"
                            height="20"
                            viewBox="0 0 25 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.4303 4.98436C22.4461 5.2031 22.4461 5.42188 22.4461 5.64062C22.4461 12.3125 17.2907 20 7.86805 20C4.96511 20 2.26842 19.1718 0 17.7344C0.412453 17.7812 0.808988 17.7969 1.23731 17.7969C3.63258 17.7969 5.83757 17 7.59837 15.6406C5.34582 15.5938 3.45812 14.1406 2.80773 12.1406C3.12501 12.1875 3.44225 12.2187 3.77541 12.2187C4.23542 12.2187 4.69548 12.1562 5.12375 12.0469C2.77604 11.5781 1.01519 9.54687 1.01519 7.09374V7.03126C1.69727 7.40627 2.49049 7.64064 3.33117 7.67185C1.95108 6.76558 1.04693 5.21873 1.04693 3.46871C1.04693 2.53123 1.30069 1.67186 1.74488 0.921852C4.26711 3.98435 8.05838 5.98432 12.3096 6.2031C12.2303 5.8281 12.1827 5.43752 12.1827 5.04688C12.1827 2.2656 14.467 0 17.3065 0C18.7817 0 20.1142 0.609373 21.0501 1.59375C22.2081 1.37501 23.3185 0.953114 24.3021 0.375003C23.9213 1.5469 23.1123 2.53128 22.0495 3.15624C23.0806 3.04691 24.08 2.7656 25 2.37502C24.3021 3.37498 23.4296 4.26557 22.4303 4.98436V4.98436Z"
                                fill="#1DA1F2"
                            ></path>
                        </svg>
                        <FormItem
                            label="Twitter Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.twitter)}
                            errorMessage={errors.twitter?.message}
                        >
                            <Controller
                                name="twitter"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="twitter"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your twitter username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.0045 4.87225C7.16613 4.87225 4.87672 7.16166 4.87672 10C4.87672 12.8383 7.16613 15.1277 10.0045 15.1277C12.8428 15.1277 15.1322 12.8383 15.1322 10C15.1322 7.16166 12.8428 4.87225 10.0045 4.87225ZM10.0045 13.3337C8.17026 13.3337 6.67076 11.8387 6.67076 10C6.67076 8.16133 8.16579 6.66629 10.0045 6.66629C11.8431 6.66629 13.3382 8.16133 13.3382 10C13.3382 11.8387 11.8387 13.3337 10.0045 13.3337V13.3337ZM16.538 4.6625C16.538 5.32746 16.0025 5.85853 15.342 5.85853C14.677 5.85853 14.1459 5.32299 14.1459 4.6625C14.1459 4.00201 14.6815 3.46647 15.342 3.46647C16.0025 3.46647 16.538 4.00201 16.538 4.6625ZM19.9342 5.87638C19.8583 4.27424 19.4924 2.85507 18.3186 1.68582C17.1494 0.516568 15.7302 0.150619 14.1281 0.070289C12.4769 -0.0234297 7.52761 -0.0234297 5.87638 0.070289C4.2787 0.146156 2.85953 0.512105 1.68582 1.68136C0.512105 2.85061 0.150619 4.26978 0.070289 5.87192C-0.0234297 7.52315 -0.0234297 12.4724 0.070289 14.1236C0.146156 15.7258 0.512105 17.1449 1.68582 18.3142C2.85953 19.4834 4.27424 19.8494 5.87638 19.9297C7.52761 20.0234 12.4769 20.0234 14.1281 19.9297C15.7302 19.8538 17.1494 19.4879 18.3186 18.3142C19.4879 17.1449 19.8538 15.7258 19.9342 14.1236C20.0279 12.4724 20.0279 7.52761 19.9342 5.87638V5.87638ZM17.801 15.8953C17.4529 16.7701 16.779 17.4439 15.8998 17.7965C14.5833 18.3186 11.4593 18.1981 10.0045 18.1981C8.54959 18.1981 5.42118 18.3142 4.10912 17.7965C3.23441 17.4484 2.56053 16.7745 2.20797 15.8953C1.68582 14.5788 1.80632 11.4549 1.80632 10C1.80632 8.54513 1.69028 5.41671 2.20797 4.10465C2.55606 3.22995 3.22995 2.55606 4.10912 2.2035C5.42564 1.68136 8.54959 1.80185 10.0045 1.80185C11.4593 1.80185 14.5878 1.68582 15.8998 2.2035C16.7745 2.5516 17.4484 3.22548 17.801 4.10465C18.3231 5.42118 18.2026 8.54513 18.2026 10C18.2026 11.4549 18.3231 14.5833 17.801 15.8953Z"
                                fill="#E1306C"
                            ></path>
                        </svg>
                        <FormItem
                            label="Instagram Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.instagram)}
                            errorMessage={errors.instagram?.message}
                        >
                            <Controller
                                name="instagram"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="instagram"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your instagram username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.47689 20H0.330365V6.64702H4.47689V20ZM2.40139 4.82555C1.07547 4.82555 0 3.72732 0 2.40139C9.49038e-09 1.7645 0.253003 1.1537 0.703352 0.703352C1.1537 0.253003 1.7645 0 2.40139 0C3.03828 0 3.64909 0.253003 4.09943 0.703352C4.54978 1.1537 4.80279 1.7645 4.80279 2.40139C4.80279 3.72732 3.72687 4.82555 2.40139 4.82555ZM19.996 20H15.8584V13.4999C15.8584 11.9507 15.8271 9.96406 13.7025 9.96406C11.5467 9.96406 11.2163 11.6471 11.2163 13.3882V20H7.07427V6.64702H11.0511V8.46849H11.1092C11.6628 7.41936 13.015 6.31219 15.0325 6.31219C19.229 6.31219 20.0004 9.07565 20.0004 12.665V20H19.996Z"
                                fill="#0E76A8"
                            ></path>
                        </svg>
                        <FormItem
                            label="Linkedin Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.linkedin)}
                            errorMessage={errors.linkedin?.message}
                        >
                            <Controller
                                name="linkedin"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="linkedin"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your linkedin username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg
                            width="25"
                            height="20"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fal"
                            data-icon="globe"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="currentColor"
                                d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM256 480C272.7 480 296.4 465.6 317.9 422.7C327.8 402.9 336.1 378.1 341.1 352H170C175.9 378.1 184.2 402.9 194.1 422.7C215.6 465.6 239.3 480 256 480V480zM164.3 320H347.7C350.5 299.8 352 278.3 352 256C352 233.7 350.5 212.2 347.7 192H164.3C161.5 212.2 160 233.7 160 256C160 278.3 161.5 299.8 164.3 320V320zM341.1 160C336.1 133 327.8 109.1 317.9 89.29C296.4 46.37 272.7 32 256 32C239.3 32 215.6 46.37 194.1 89.29C184.2 109.1 175.9 133 170 160H341.1zM379.1 192C382.6 212.5 384 233.9 384 256C384 278.1 382.6 299.5 379.1 320H470.7C476.8 299.7 480 278.2 480 256C480 233.8 476.8 212.3 470.7 192H379.1zM327.5 43.66C348.5 71.99 365.1 112.4 374.7 160H458.4C432.6 105.5 385.3 63.12 327.5 43.66V43.66zM184.5 43.66C126.7 63.12 79.44 105.5 53.56 160H137.3C146.9 112.4 163.5 71.99 184.5 43.66V43.66zM32 256C32 278.2 35.24 299.7 41.28 320H132C129.4 299.5 128 278.1 128 256C128 233.9 129.4 212.5 132 192H41.28C35.24 212.3 32 233.8 32 256V256zM458.4 352H374.7C365.1 399.6 348.5 440 327.5 468.3C385.3 448.9 432.6 406.5 458.4 352zM137.3 352H53.56C79.44 406.5 126.7 448.9 184.5 468.3C163.5 440 146.9 399.6 137.3 352V352z"
                            ></path>
                        </svg>
                        <FormItem
                            label="Portfolio URL"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.personal_site)}
                            errorMessage={errors.personal_site?.message}
                        >
                            <Controller
                                name="personal_site"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="personal_site"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your portfolio URL"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    {/* facebook */}
                    <div className="flex items-center gap-3">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 0C4.4775 0 0 4.4775 0 10C0 14.875 3.4375 19.3125 8.125 19.9375V12.5H5.625V10H8.125V8.125C8.125 5.625 9.6875 4.0625 12.1875 4.0625C13.4375 4.0625 14.375 4.1875 14.375 4.1875V6.5625H13.0625C11.9375 6.5625 11.875 7.1875 11.875 7.75V10H14.375L13.75 12.5H11.875V19.9375C16.5625 19.3125 20 14.875 20 10C20 4.4775 15.5225 0 10 0Z"
                                fill="#1877F2"
                            ></path>
                        </svg>
                        <FormItem
                            label="Facebook Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.facebook)}
                            errorMessage={errors.facebook?.message}
                        >
                            <Controller
                                name="facebook"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="facebook"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your facebook username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    {/* behance */}
                    <div className="flex items-center gap-3">
                        <BsBehance size={25} color="#1769FF" />
                        <FormItem
                            label="Behance Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.behance)}
                            errorMessage={errors.behance?.message}
                        >
                            <Controller
                                name="behance"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="behance"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your behance username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    {/* dribble */}
                    <div className="flex items-center gap-3">
                        <BsDribbble size={25} color="#EA4C89" />
                        <FormItem
                            label="Dribble Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.dribble)}
                            errorMessage={errors.dribble?.message}
                        >
                            <Controller
                                name="dribble"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="dribble"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your dribble username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    {/* pinterest */}
                    <div className="flex items-center gap-3">
                        <BsPinterest size={25} color="#E60023" />
                        <FormItem
                            label="Pinterest Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.pinterest)}
                            errorMessage={errors.pinterest?.message}
                        >
                            <Controller
                                name="pinterest"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="pinterest"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your pinterest username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    {/* other */}
                    <div className="flex items-center gap-3">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 0C4.4775 0 0 4.4775 0 10C0 14.875 3.4375 19.3125 8.125 19.9375V12.5H5.625V10H8.125V8.125C8.125 5.625 9.6875 4.0625 12.1875 4.0625C13.4375 4.0625 14.375 4.1875 14.375 4.1875V6.5625H13.0625C11.9375 6.5625 11.875 7.1875 11.875 7.75V10H14.375L13.75 12.5H11.875V19.9375C16.5625 19.3125 20 14.875 20 10C20 4.4775 15.5225 0 10 0Z"
                                fill="#1877F2"
                            ></path>
                        </svg>
                        <FormItem
                            label="Other Username"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.other)}
                            errorMessage={errors.other?.message}
                        >
                            <Controller
                                name="other"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="other"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your other username"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex items-center gap-3">
                        <PhoneIcon size={25} color="#1DA1F2" />
                        <FormItem
                            label="Mobile Number"
                            className="mb-0 w-full"
                            invalid={Boolean(errors.mobile_number)}
                            errorMessage={errors.mobile_number?.message}
                        >
                            <Controller
                                name="mobile_number"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        id="mobile_number"
                                        className="border rounded block w-full py-1.5 px-3"
                                        placeholder="Enter your mobile number"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    
                </div>
                <div className="flex justify-end">
                    <Button variant="solid" className="mt-5 text-ac-dark">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SocialInformation
