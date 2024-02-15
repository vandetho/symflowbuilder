import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

type ScrollTopProps = {};

const ScrollTop: React.FC<ScrollTopProps> = ({}) => {
    return (
        <div className="flex fixed right-2 bottom-2">
            <Button
                className="rounded-3xl h-14"
                variant="secondary"
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <Icon icon="icons8:chevron-up-round" width={24} />
            </Button>
        </div>
    );
};

export default ScrollTop;
