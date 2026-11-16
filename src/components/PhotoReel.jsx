import { useState } from 'react';
import {
  Button,
  Card,
  Caption1,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Title3,
} from '@fluentui/react-components';
import { DismissRegular, ImageRegular } from '@fluentui/react-icons';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const momentStories = {
  'couple-portrait': {
    title: 'Frames of Love 📸',
    subtitle: 'A glimpse into the memories Diwarkar and Shwetha have made together.',
    paragraphs: [
      { text: 'A few favorite moments from our journey, held close in every frame.' },
    ],
  },
};

const journeyGallery = Object.entries(import.meta.glob('../photos/*.{jpg,JPG,jpeg,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
}))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, src], index) => ({
    src,
    alt: `Memory ${index + 1} from Diwarkar and Shwetha's journey`,
  }));

export default function PhotoReel({ photos }) {
  const reducedMotion = useReducedMotion();
  const [selectedMoment, setSelectedMoment] = useState(null);

  function openMoment(event, moment) {
    if (event.type === 'keydown') {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
    }
    setSelectedMoment(moment);
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => {
          const story = momentStories[photo.id] || {
            title: photo.title,
            subtitle: photo.caption,
            paragraphs: [{ text: photo.caption }],
          };
          const momentPhoto = photo.id === 'couple-portrait' ? { ...photo, gallery: journeyGallery } : photo;
          const moment = { photo: momentPhoto, story };

          return (
            <motion.div
              key={photo.id}
              className={`photo-reveal photo-reveal--${index + 1}`}
              initial={reducedMotion ? false : { opacity: 0, y: 28, rotate: index === 1 ? 1.4 : -1.1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: reducedMotion ? 0 : index * 0.14 }}
            >
              <Card
                className={`photo-card photo-card--${index + 1}${photo.id === 'couple-portrait' ? ' photo-card--couple' : ''}`}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Read story: ${story.title}`}
                onClick={(event) => openMoment(event, moment)}
                onKeyDown={(event) => openMoment(event, moment)}
              >
                <div className="photo-card-inner">
                  <div className="photo-card-front">
                    <img src={photo.src} alt={photo.alt} loading="lazy" />
                    <div className="photo-caption">
                      <Title3>{story.title}</Title3>
                      <Caption1>{story.subtitle}</Caption1>
                      <motion.span
                        className="photo-card-action"
                        aria-hidden="true"
                        initial={false}
                        whileInView={reducedMotion ? undefined : { opacity: [1, 0.6, 1] }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 1.25, repeat: 3, ease: 'easeInOut' }}
                      >
                        <span>Open story</span>
                        <ArrowUpRight size={17} />
                      </motion.span>
                    </div>
                  </div>
                  <div className="photo-card-back" aria-hidden="true">
                    <div className="photo-card-back-content">
                      <ArrowUpRight size={30} />
                      <strong>Click or tap to open the story</strong>
                      <span>Press Enter to open</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {photos.length === 0 && (
          <Card className="empty-state">
            <ImageRegular className="empty-state-icon" aria-hidden="true" />
            <Title3>Photos will find their place here</Title3>
            <p className="body-muted">No approved photos are attached to this invitation yet.</p>
          </Card>
        )}
      </div>
      <Dialog open={selectedMoment !== null} onOpenChange={(_, data) => !data.open && setSelectedMoment(null)}>
        <DialogSurface className="moment-dialog">
          {selectedMoment && (
            <DialogBody>
              <DialogTitle
                action={(
                  <DialogTrigger action="close">
                    <Button appearance="subtle" aria-label="Close story" icon={<DismissRegular />} />
                  </DialogTrigger>
                )}
              >
                {selectedMoment.story.title}
              </DialogTitle>
              <DialogContent>
                <p className="moment-dialog-subtitle">{selectedMoment.story.subtitle}</p>
                <div className="moment-story">
                  {selectedMoment.story.paragraphs.map((paragraph, index) => (
                    <p className={paragraph.lead ? 'moment-story-lead' : paragraph.emphasis ? 'moment-story-emphasis' : undefined} lang={paragraph.lang} key={index}>
                      {paragraph.text}
                    </p>
                  ))}
                </div>
                {selectedMoment.photo.id === 'couple-portrait' && (
                  selectedMoment.photo.gallery?.length ? (
                    <div className="moment-gallery">
                      {selectedMoment.photo.gallery.map((image) => (
                        <img src={image.src} alt={image.alt} loading="lazy" key={image.src} />
                      ))}
                    </div>
                  ) : (
                    <div className="moment-gallery-empty">
                      <ImageRegular aria-hidden="true" />
                      <span>Your journey gallery is ready for at least 10 photos.</span>
                    </div>
                  )
                )}
              </DialogContent>
            </DialogBody>
          )}
        </DialogSurface>
      </Dialog>
    </>
  );
}