import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Phone,
  Ambulance,
  Flame,
  Shield,
  Hospital,
  Heart,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Mail,
  Globe,
  MessageCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

type ChannelType = 'line' | 'email' | 'website';
type Contact = {
  name: string;
  numbers: { number: string; label: string; isPrimary?: boolean }[];
  channels?: { type: ChannelType; value: string; label: string }[];
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

export function EmergencyContacts() {
  const t = useTranslations('home.emergencyContacts');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const emergencyContacts: Contact[] = [
    {
      name: t('contacts.police.name'),
      numbers: [
        { number: '191', label: t('contacts.police.numbers.primary'), isPrimary: true },
        { number: '1599', label: t('contacts.police.numbers.tourist') },
        { number: '1137', label: t('contacts.police.numbers.complaint') },
      ],
      channels: [
        { type: 'line', value: '@191police', label: t('contacts.police.channels.line') },
        {
          type: 'website',
          value: 'https://www.royalthaipolice.go.th',
          label: t('contacts.police.channels.website'),
        },
      ],
      description: t('contacts.police.description'),
      icon: Shield,
      color: 'bg-gray-700',
    },
    {
      name: t('contacts.medical.name'),
      numbers: [
        { number: '1669', label: t('contacts.medical.numbers.primary'), isPrimary: true },
        { number: '1646', label: t('contacts.medical.numbers.hospital') },
        { number: '1554', label: t('contacts.medical.numbers.health') },
      ],
      channels: [
        {
          type: 'website',
          value: 'https://niems.go.th',
          label: t('contacts.medical.channels.website'),
        },
      ],
      description: t('contacts.medical.description'),
      icon: Ambulance,
      color: 'bg-primary',
    },
    {
      name: t('contacts.fire.name'),
      numbers: [
        { number: '199', label: t('contacts.fire.numbers.primary'), isPrimary: true },
        { number: '02-246-0199', label: t('contacts.fire.numbers.bma') },
        { number: '1784', label: t('contacts.fire.numbers.disaster') },
      ],
      channels: [
        { type: 'line', value: '@199fire', label: t('contacts.fire.channels.line') },
      ],
      description: t('contacts.fire.description'),
      icon: Flame,
      color: 'bg-primary',
    },
    {
      name: t('contacts.disaster.name'),
      numbers: [
        { number: '1784', label: t('contacts.disaster.numbers.primary'), isPrimary: true },
        { number: '02-141-9611', label: t('contacts.disaster.numbers.office') },
      ],
      channels: [
        { type: 'line', value: '@disaster1784', label: t('contacts.disaster.channels.line') },
        {
          type: 'website',
          value: 'https://www.disaster.go.th',
          label: t('contacts.disaster.channels.website'),
        },
        { type: 'email', value: 'disaster@disaster.go.th', label: t('contacts.disaster.channels.email') },
      ],
      description: t('contacts.disaster.description'),
      icon: AlertTriangle,
      color: 'bg-primary',
    },
    {
      name: t('contacts.health.name'),
      numbers: [
        { number: '1422', label: t('contacts.health.numbers.primary'), isPrimary: true },
        { number: '1330', label: t('contacts.health.numbers.disease') },
      ],
      description: t('contacts.health.description'),
      icon: Heart,
      color: 'bg-gray-700',
    },
    {
      name: t('contacts.electricity.name'),
      numbers: [
        { number: '1130', label: t('contacts.electricity.numbers.primary'), isPrimary: true },
        { number: '1129', label: t('contacts.electricity.numbers.provincial') },
      ],
      channels: [
        { type: 'line', value: '@mea1130', label: t('contacts.electricity.channels.line') },
        { type: 'website', value: 'https://www.mea.or.th', label: t('contacts.electricity.channels.website') },
      ],
      description: t('contacts.electricity.description'),
      icon: AlertTriangle,
      color: 'bg-gray-700',
    },
    {
      name: t('contacts.water.name'),
      numbers: [
        { number: '1125', label: t('contacts.water.numbers.primary'), isPrimary: true },
        { number: '1662', label: t('contacts.water.numbers.provincial') },
      ],
      channels: [
        { type: 'line', value: '@mwa1125', label: t('contacts.water.channels.line') },
      ],
      description: t('contacts.water.description'),
      icon: Hospital,
      color: 'bg-gray-700',
    },
  ];

  const channelIcon = (type: ChannelType): ReactNode => {
    switch (type) {
      case 'line':
        return <MessageCircle className="h-3.5 w-3.5" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5" />;
      case 'website':
        return <Globe className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 py-2 text-center">
        <h2 className="text-gray-900">{t('heading')}</h2>
        <p className="text-xs text-gray-500">{t('subheading')}</p>
      </div>

      <div className="space-y-2">
        {emergencyContacts.map((contact, index) => {
          const Icon = contact.icon;
          const isExpanded = expandedId === index;
          const primaryNumber =
            contact.numbers.find(n => n.isPrimary) || contact.numbers[0];
          const otherNumbers = contact.numbers.filter(n => !n.isPrimary);
          const hasMore =
            otherNumbers.length > 0 ||
            (contact.channels && contact.channels.length > 0);

          return (
            <div
              key={contact.name}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex items-center gap-3 p-4">
                <div className={cn('rounded-lg p-2.5 shrink-0', contact.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <a
                  href={`tel:${primaryNumber.number}`}
                  className="group min-w-0 flex-1"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="mb-1 text-3xl leading-none text-gray-900 transition-colors group-active:text-primary">
                    {primaryNumber.number}
                  </div>
                  <div className="text-sm text-gray-600">{contact.name}</div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {primaryNumber.label}
                  </div>
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${primaryNumber.number}`}
                    className="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100 active:scale-95"
                    onClick={e => e.stopPropagation()}
                  >
                    <Phone className="h-5 w-5 text-gray-600" />
                  </a>
                  {hasMore && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : index)}
                      className="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && hasMore && (
                <div className="space-y-3 border-t border-gray-200 bg-gray-50 p-4">
                  {otherNumbers.length > 0 && (
                    <div className="space-y-2">
                      <div className="mb-2 text-xs text-gray-500">
                        {t('extraNumbers')}
                      </div>
                      {otherNumbers.map(num => (
                        <a
                          key={num.number}
                          href={`tel:${num.number}`}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 transition-colors hover:border-primary"
                          onClick={e => e.stopPropagation()}
                        >
                          <div>
                            <div className="text-gray-900">{num.number}</div>
                            <div className="text-xs text-gray-500">
                              {num.label}
                            </div>
                          </div>
                          <Phone className="h-4 w-4 text-primary" />
                        </a>
                      ))}
                    </div>
                  )}

                  {contact.channels && (
                    <div className="space-y-2">
                      <div className="mb-2 text-xs text-gray-500">
                        {t('otherChannels')}
                      </div>
                      {contact.channels.map(channel => (
                        <a
                          key={channel.value}
                          href={
                            channel.type === 'email'
                              ? `mailto:${channel.value}`
                              : channel.type === 'website'
                              ? channel.value
                              : `https://line.me/R/ti/p/${channel.value.replace(
                                  '@',
                                  ''
                                )}`
                          }
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 transition-colors hover:border-primary"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            {channelIcon(channel.type)}
                            <div>
                              <div className="text-gray-900">
                                {channel.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {channel.value}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
