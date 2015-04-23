<?php
/*****************************************************************************
 * Copyright (c) 2011 IOWA, llc dba Wiredrive
 * Author J.O.D. (Joint Operations/Development)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ****************************************************************************/

/**
 * Simple feed parsing class.  Does some validation and data conversion for
 * convinience but it is not a full parsing library.
 */
class Feed_Parser 
{
    /**
     * Contents
     * The current raw contents of the feed.
     * @var string
     */
    protected $contents = null;

    /**
     * Format
     * The current format to parse the feed
     * @var string
     */
    protected $format = null;

    /**
     * Valid formats
     * A list of valid formats that this parser can handle
     * @var array
     */
    protected $validFormats = array('xml', 'json', 'array');

    /**
     * Xml
     * The xml object that represents the current contents
     * @var SimpleXMLElement
     */
    protected $xml = null;

    /**
     * Items only
     * Flag to specify if everything should be returned or just items, 
     * only applies to json data fetching
     *
     * @var bool
     */
    protected $itemsOnly = null;

    /**
     * Constructor
     *
     * @param   string      $format
     */
    public function __construct($format = 'json')
    {
        $this->setFormat($format);
        $this->setItemsOnly(true);
    }

    /**
     * @param   string      $format
     * @return  Feed_Parser
     */
    public function setFormat($format)
    {
        $validFormats = $this->getValidFormats();
        if (! in_array($format, $validFormats)) {
            throw new Exception('Invalid parsing format');
        }
        $this->format = $format;
        return $this;
    }

    /**
     * @return  string
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * @return array
     */
    public function getValidFormats()
    {
        return $this->validFormats;
    }

    /**
     * @param   bool    $itemsOnly
     * @return  Feed_Parser
     */
    public function setItemsOnly($itemsOnly)
    {
        $this->itemsOnly = (bool) $itemsOnly;
        return $this;
    }

    /**
     * @return  bool
     */
    public function itemsOnly()
    {
        return $this->itemsOnly;
    }

    /**
     * When setting content, the current parsed xml feed is destroyed
     *
     * @param   string      $contents
     * @return  Feed_Parser
     */
    public function setContents($contents)
    {
        $this->contents = $contents;
        $this->xml = null;
        return $this;
    }

    /**
     * @return  SimpleXMLElement
     */
    protected function getXml()
    {
        return $this->xml;
    }

    /**
     * Return the current raw contents
     * @return  string
     */
    public function getContents()
    {
        return $this->contents;        
    }

    /**
     * Process
     * Convert the current contents into a simple xml element and return
     * the data based on the desired format.
     *
     */
    public function process()
    {
        $contents = $this->getContents();
        if (empty($contents)) {
            throw new Exception('Invalid contents for feed processing');
        }

        try {
            $xml = new SimpleXMLElement($contents);
        } catch (Exception $exception) {
            throw new Exception('Failed parsing contents', 1, $exception);
        }

        $this->xml = $xml;
        
        return $this->processOutput($this->getFormat(), $this->itemsOnly()); 
    }

    /**
     * Process the current xml object based on the desired format
     * 
     * @param   string      $format
     * @param   bool        $itemsOnly
     * @return  mixed
     */
    public function processOutput($format, $itemsOnly)
    {
        $validFormats = $this->getValidFormats();
        if (! in_array($format, $validFormats)) {
            throw new Exception('Invalid format requested');
        }
        
        $xml = $this->getXml();
        if (! $xml instanceof SimpleXMLElement) {
            throw new Exception('Cannot process an non-existant feed');
        }
        switch ($format) {
            case 'xml';
                return $this->getContents();
            case 'json':
                return $this->processJson($itemsOnly);
            case 'array':
                return $this->processArray($itemsOnly);
        }
    }

    /**
     * Process Json
     * Convert the array output into json
     *
     * @param   int     $itemsOnly
     * @return  string
     */
    protected function processJson($itemsOnly)
    {
        $feedData = $this->processArray($itemsOnly);
        if (! is_array($feedData)) {
            throw new Exception('Unexpected data returned');
        }
        return json_encode($feedData);
    }

    /**
     * Process Array
     * Process the currently set xml object as a usable array.
     *
     * @param   bool    $itemsOnly
     * @return  string
     */
    protected function processArray($itemsOnly)
    {
        $xml = $this->getXml();
        $response = array();

        /* create an array to represent the rss feed */
        $feedData = array();

        /*
         * Get the just the channel object 
         */
        $channel = $this->xml->channel;
        
        /*
         * Get any namespaces added to the RSS
         */
        $namespaces = $this->xml->getNamespaces(TRUE);
        
        if (! $itemsOnly) {
            foreach ($channel->getChildren() as $property) {
                
                /* ignore all items that have children */
                $children = $property->children();
                if (count($children)) {
                    continue;
                }
                
                $attribName = $property->getName();
                $feedData[$attribName] = (string) $channel->$feedAttrib;
            }
        }

        /*
         * process items
         */
        $items = array();
        foreach ($channel->item as $item) {
            /*
             * Add entities with children to the reponse array
             */
            $itemData = array();
            foreach ($item->children() as $property) {
                /*
                 * Get the name of the element
                 */
                $propName   = $property->getName();
                $attributes = $property->attributes(); 
                if (0 == count($attributes)) {
                    $propData = (string) $item->$propName;
                } else {
                    $propData = array();
                    foreach ($attributes as $attribute) {
                        $attribName = $attribute->getName();
                        $propData[$attribName] = (string) $attribute;
                    }
                }
                $itemData[$propName] = $propData;
            }
        
            /*
             * Cycle through any defined names spaces and 
             * extract the elements, these don't show up in standard children
             */
            foreach($namespaces as $name => $namespace) {
                $nsChildren = $item->children($namespace);
                
                /*
                 * Cycle through the elements defined for this namespace
                 */  
                foreach($nsChildren as $nsItem) {
                    /*
                     * Get the name for this element
                     */
                    $nsItemName = $nsItem->getName();
                    $nsItemData = array(); 
                    
                    /*
                     * Add the attributes
                     */
                    foreach ($nsItem->attributes() as $attribute) {
                        $attribName = $attribute->getName();
                        $nsItemData[$attribName] = (string) $attribute;  
                    }
        
                    /*
                     * Add the value of the element if it exists
                     */
                    $content = (string) $nsItem;
                    if (!empty( $content) ) {
                        $nsItemData['content'] = $content;
                    }
                    
                    if (! isset($itemData[$nsItemName])) {
                        $itemData[$nsItemName] = array();
                    }
                    $itemData[$nsItemName][] = $nsItemData;
                }
            }
            $feedData[] = $itemData;
        }
        return $feedData;
    }

    /**
     * Pull out a propery from the top level feed only.
     *
     * @param   string      $propertyName
     * @return  string
     */
    public function getProperty($propertyName)
    {
        $xml = $this->getXml();
        if (null == $xml) {
            throw new Exception('No feed loaded');
        }
        $channel = $xml->channel;
        return (string) $channel->$propertyName;
    }
}
