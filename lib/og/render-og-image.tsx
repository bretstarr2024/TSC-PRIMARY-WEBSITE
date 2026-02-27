import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { OG_WIDTH, OG_HEIGHT, COLORS, OG_BADGES, getTitleFontSize, truncateTitle } from './og-constants';

export interface OgImageOptions {
  title: string;
  badge?: string;
  subtitle?: string;
  accentColor?: string;
}

// Font + asset loading — read from filesystem, cached at module level
let _pressStartFont: ArrayBuffer | null = null;
let _geistFont: ArrayBuffer | null = null;
let _ochoBase64: string | null = null;

function getPressStartFont(): ArrayBuffer {
  if (!_pressStartFont) {
    const buf = readFileSync(join(process.cwd(), 'app/fonts/PressStart2P-Regular.ttf'));
    _pressStartFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }
  return _pressStartFont;
}

function getInterFont(): ArrayBuffer {
  if (!_geistFont) {
    const buf = readFileSync(join(process.cwd(), 'app/fonts/Inter-SemiBold.ttf'));
    _geistFont = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }
  return _geistFont;
}

function getOchoBase64(): string {
  if (!_ochoBase64) {
    const buf = readFileSync(join(process.cwd(), 'public/images/ocho-color.png'));
    _ochoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
  }
  return _ochoBase64;
}

export async function renderOgImage(options: OgImageOptions): Promise<ImageResponse> {
  const { title: rawTitle, badge, subtitle, accentColor } = options;

  const pressStartData = getPressStartFont();
  const interData = getInterFont();
  const ochoSrc = getOchoBase64();

  const badgeConfig = badge ? OG_BADGES[badge] : undefined;
  const accent = accentColor || badgeConfig?.color || COLORS.atomicTangerine;
  const title = truncateTitle(rawTitle);
  const fontSize = getTitleFontSize(title);

  // Special layout for homepage and contact
  const isHero = badge === 'homepage' || badge === 'contact';

  return new ImageResponse(
    (
      <div
        style={{
          width: OG_WIDTH,
          height: OG_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: COLORS.background,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient top border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 4,
            background: `linear-gradient(90deg, ${COLORS.atomicTangerine}, ${COLORS.neonCactus}, ${COLORS.tidalWave})`,
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 56px',
            height: '100%',
            position: 'relative',
            justifyContent: isHero ? 'center' : 'flex-start',
            alignItems: isHero ? 'center' : 'flex-start',
          }}
        >
          {/* Top row: badge + ocho */}
          {!isHero && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                marginBottom: 32,
              }}
            >
              {badgeConfig ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: accent,
                    borderRadius: 6,
                    padding: '8px 16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: 12,
                      color: accent === COLORS.neonCactus ? COLORS.background : '#FFFFFF',
                      letterSpacing: 1,
                    }}
                  >
                    {badgeConfig.label}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex' }} />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ochoSrc}
                alt=""
                width={48}
                height={48}
                style={{ opacity: 0.8 }}
              />
            </div>
          )}

          {/* Hero layout: Ocho above title */}
          {isHero && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={ochoSrc}
              alt=""
              width={56}
              height={56}
              style={{ opacity: 0.8, marginBottom: 24 }}
            />
          )}

          {/* Title with glow effect */}
          <div style={{ display: 'flex', position: 'relative', width: '100%', justifyContent: isHero ? 'center' : 'flex-start' }}>
            {/* Glow layer (behind) */}
            <span
              style={{
                position: 'absolute',
                fontFamily: '"Press Start 2P"',
                fontSize: isHero ? 48 : fontSize,
                color: accent,
                opacity: 0.4,
                textAlign: isHero ? 'center' : 'left',
                lineHeight: 1.5,
                maxWidth: isHero ? '100%' : '90%',
              }}
            >
              {title}
            </span>
            {/* Title text */}
            <span
              style={{
                fontFamily: '"Press Start 2P"',
                fontSize: isHero ? 48 : fontSize,
                color: COLORS.text,
                lineHeight: 1.5,
                textAlign: isHero ? 'center' : 'left',
                maxWidth: isHero ? '100%' : '90%',
                position: 'relative',
              }}
            >
              {title}
            </span>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <span
              style={{
                fontFamily: '"Inter"',
                fontSize: 20,
                color: COLORS.textMuted,
                marginTop: 20,
                lineHeight: 1.5,
                maxWidth: isHero ? '80%' : '85%',
                textAlign: isHero ? 'center' : 'left',
              }}
            >
              {subtitle}
            </span>
          )}

          {/* Hero badge below subtitle */}
          {isHero && badgeConfig && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: accent,
                borderRadius: 6,
                padding: '8px 16px',
                marginTop: 24,
              }}
            >
              <span
                style={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: 10,
                  color: accent === COLORS.neonCactus ? COLORS.background : '#FFFFFF',
                  letterSpacing: 1,
                }}
              >
                {badgeConfig.label}
              </span>
            </div>
          )}

          {/* Bottom section: gradient line + site name */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              bottom: 48,
              left: 56,
              right: 56,
            }}
          >
            {/* Gradient divider */}
            <div
              style={{
                width: '60%',
                height: 2,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                marginBottom: 16,
                display: 'flex',
              }}
            />
            <span
              style={{
                fontFamily: '"Inter"',
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.textGreige,
                letterSpacing: 2,
              }}
            >
              THE STARR CONSPIRACY
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: 'Press Start 2P',
          data: pressStartData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Inter',
          data: interData,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  );
}
