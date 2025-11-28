import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, ThumbsUp, MessageCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface RatingSystemProps {
  requestId: string;
  onClose: () => void;
}

const ratingSchema = z.object({
  rating: z.number('กรุณาให้คะแนน').min(1, 'กรุณาให้คะแนน').max(5),
  feedback: z
    .string()
    .trim()
    .max(500, 'ข้อความยาวเกินไป (สูงสุด 500 ตัวอักษร)')
    .optional(),
  tags: z.array(z.string()).max(5, 'เลือกได้สูงสุด 5 แท็ก'),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

export function RatingSystem({ requestId, onClose }: RatingSystemProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      feedback: '',
      tags: [],
    },
  });

  const rating =
    useWatch({
      control: form.control,
      name: 'rating',
    }) ?? 0;
  const selectedTags =
    useWatch({
      control: form.control,
      name: 'tags',
    }) ?? [];

  const feedbackTags = [
    'รวดเร็ว',
    'มีน้ำใจ',
    'เป็นมืออาชีพ',
    'ช่วยเหลือดี',
    'ติดต่อสะดวก',
    'ได้รับของครบ',
    'ตรงเวลา',
    'แก้ปัญหาได้ดี',
  ];

  const handleSubmit = (values: RatingFormValues) => {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
    const newRating = {
      id: new Date().toISOString(),
      requestId,
      rating: values.rating,
      feedback: values.feedback?.trim() ?? '',
      tags: values.tags,
      createdAt: new Date().toISOString(),
    };
    ratings.push(newRating);
    localStorage.setItem('ratings', JSON.stringify(ratings));

    toast.success('ขอบคุณสำหรับการให้คะแนนและความคิดเห็น!');
    onClose();
  };

  const toggleTag = (tag: string) => {
    const currentTags = form.getValues('tags');
    const nextTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    form.setValue('tags', nextTags, { shouldDirty: true });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="bg-white rounded-2xl shadow-2xl"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg text-gray-900">
                    ให้คะแนนการช่วยเหลือ
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    ความคิดเห็นของคุณมีค่า
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                คุณพอใจกับการช่วยเหลือแค่ไหน?
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      form.setValue('rating', star, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {form.formState.errors.rating?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {form.formState.errors.rating.message}
                </p>
              )}
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {rating === 5 && 'ยอดเยี่ยมมาก!'}
                  {rating === 4 && 'ดีมาก'}
                  {rating === 3 && 'ดี'}
                  {rating === 2 && 'พอใช้'}
                  {rating === 1 && 'ควรปรับปรุง'}
                </p>
              )}
            </div>

            {/* Feedback Tags */}
            {rating >= 4 && (
              <div>
                <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 mb-2">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span>สิ่งที่ประทับใจ (เลือกได้หลายอัน)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border-2 transition-colors ${
                        selectedTags.includes(tag)
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Text */}
            <div>
              <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>ข้อเสนอแนะเพิ่มเติม (ถ้ามี)</span>
              </label>
              <textarea
                {...form.register('feedback')}
                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm sm:text-base resize-none"
                rows={4}
              />
              {form.formState.errors.feedback?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {form.formState.errors.feedback.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0}
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              ส่งความคิดเห็น
            </button>

            <p className="text-[10px] sm:text-xs text-gray-500 text-center">
              ความคิดเห็นของคุณจะช่วยให้เราพัฒนาระบบให้ดียิ่งขึ้น
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
